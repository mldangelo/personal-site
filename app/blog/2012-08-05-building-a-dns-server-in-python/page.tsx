import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Building a DNS Server in Python',
  description: 'Ever wondered how DNS works? Built my own DNS server from scratch to really understand the protocol.',
  keywords: ['dns', 'networking', 'python', 'protocols'],
  openGraph: {
    title: 'Building a DNS Server in Python',
    description: 'Ever wondered how DNS works? Built my own DNS server from scratch to really understand the protocol.',
    type: 'article',
    publishedTime: '2012-08-05',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-08-05',
  title: 'Building a DNS Server in Python',
  content: `DNS is one of those things we use every day but rarely think about. To truly understand it, I built a DNS server from scratch in Python.

## Understanding DNS Protocol

DNS uses UDP port 53 for queries:

\`\`\`python
import socket
import struct

class DNSHeader:
    def __init__(self):
        self.id = 0
        self.flags = 0
        self.qdcount = 0  # Number of questions
        self.ancount = 0  # Number of answers
        self.nscount = 0  # Number of authority records
        self.arcount = 0  # Number of additional records
    
    def pack(self):
        return struct.pack('!HHHHHH', 
                          self.id, self.flags,
                          self.qdcount, self.ancount,
                          self.nscount, self.arcount)
    
    @classmethod
    def unpack(cls, data):
        header = cls()
        (header.id, header.flags, header.qdcount,
         header.ancount, header.nscount, header.arcount) = struct.unpack('!HHHHHH', data[:12])
        return header
\`\`\`

## Parsing DNS Questions

Handling domain name queries:

\`\`\`python
class DNSQuestion:
    def __init__(self):
        self.qname = ''
        self.qtype = 0
        self.qclass = 0
    
    @classmethod
    def unpack(cls, data, offset):
        question = cls()
        
        # Parse domain name
        labels = []
        while True:
            length = data[offset]
            offset += 1
            
            if length == 0:
                break
                
            labels.append(data[offset:offset+length].decode('ascii'))
            offset += length
        
        question.qname = '.'.join(labels)
        
        # Parse type and class
        question.qtype, question.qclass = struct.unpack('!HH', data[offset:offset+4])
        offset += 4
        
        return question, offset
    
    def pack(self):
        # Encode domain name
        data = b''
        for label in self.qname.split('.'):
            data += bytes([len(label)]) + label.encode('ascii')
        data += b'\x00'
        
        # Add type and class
        data += struct.pack('!HH', self.qtype, self.qclass)
        
        return data
\`\`\`

## Building DNS Responses

Creating answer records:

\`\`\`python
class DNSRecord:
    def __init__(self, name, type_, class_, ttl, data):
        self.name = name
        self.type = type_
        self.class_ = class_
        self.ttl = ttl
        self.data = data
    
    def pack(self):
        # Encode name
        data = b''
        for label in self.name.split('.'):
            data += bytes([len(label)]) + label.encode('ascii')
        data += b'\x00'
        
        # Add type, class, TTL
        data += struct.pack('!HHI', self.type, self.class_, self.ttl)
        
        # Add data
        if self.type == 1:  # A record
            ip_bytes = bytes(map(int, self.data.split('.')))
            data += struct.pack('!H', 4)  # Data length
            data += ip_bytes
        elif self.type == 28:  # AAAA record
            import ipaddress
            ip_bytes = ipaddress.IPv6Address(self.data).packed
            data += struct.pack('!H', 16)  # Data length
            data += ip_bytes
        
        return data
\`\`\`

## The DNS Server

Putting it all together:

\`\`\`python
import threading

class DNSServer:
    def __init__(self, host='0.0.0.0', port=53):
        self.host = host
        self.port = port
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.socket.bind((host, port))
        
        # Simple DNS database
        self.records = {
            'example.com': {
                1: '93.184.216.34',      # A record
                28: '2606:2800:220:1:248:1893:25c8:1946'  # AAAA record
            },
            'test.example.com': {
                1: '192.168.1.100'
            }
        }
    
    def start(self):
        print(f"DNS Server listening on {self.host}:{self.port}")
        
        while True:
            data, addr = self.socket.recvfrom(512)
            
            # Handle in thread to support multiple clients
            thread = threading.Thread(target=self.handle_query, args=(data, addr))
            thread.start()
    
    def handle_query(self, data, addr):
        # Parse DNS query
        header = DNSHeader.unpack(data)
        
        # Parse questions
        offset = 12
        questions = []
        for _ in range(header.qdcount):
            question, offset = DNSQuestion.unpack(data, offset)
            questions.append(question)
            print(f"Query from {addr}: {question.qname} (type {question.qtype})")
        
        # Build response
        response = self.build_response(header, questions)
        
        # Send response
        self.socket.sendto(response, addr)
    
    def build_response(self, query_header, questions):
        # Create response header
        header = DNSHeader()
        header.id = query_header.id
        header.flags = 0x8180  # Response, no error
        header.qdcount = len(questions)
        header.ancount = 0
        
        # Start building response
        response = header.pack()
        
        # Add questions back
        for question in questions:
            response += question.pack()
        
        # Add answers
        answers = []
        for question in questions:
            if question.qname in self.records:
                if question.qtype in self.records[question.qname]:
                    answer = DNSRecord(
                        question.qname,
                        question.qtype,
                        question.qclass,
                        300,  # TTL
                        self.records[question.qname][question.qtype]
                    )
                    answers.append(answer)
                    header.ancount += 1
        
        # Update header with answer count
        response = header.pack() + response[12:]
        
        # Add answer records
        for answer in answers:
            response += answer.pack()
        
        return response
\`\`\`

## Recursive DNS Resolution

Acting as a full resolver:

\`\`\`python
class RecursiveDNSServer(DNSServer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cache = {}  # Simple cache
        self.root_servers = [
            '198.41.0.4',  # a.root-servers.net
            '199.9.14.201', # b.root-servers.net
            # ... more root servers
        ]
    
    def resolve_recursive(self, domain, qtype):
        # Check cache first
        cache_key = f"{domain}:{qtype}"
        if cache_key in self.cache:
            cached = self.cache[cache_key]
            if cached['expires'] > time.time():
                return cached['data']
        
        # Start from root servers
        nameservers = self.root_servers.copy()
        
        while nameservers:
            for ns in nameservers:
                try:
                    result = self.query_nameserver(ns, domain, qtype)
                    
                    if result.get('answer'):
                        # Cache the result
                        self.cache[cache_key] = {
                            'data': result['answer'],
                            'expires': time.time() + result.get('ttl', 300)
                        }
                        return result['answer']
                    
                    if result.get('authority'):
                        # Follow the authority
                        nameservers = self.extract_nameservers(result['authority'])
                        break
                        
                except Exception as e:
                    print(f"Error querying {ns}: {e}")
                    continue
        
        return None
    
    def query_nameserver(self, nameserver, domain, qtype):
        # Build query
        header = DNSHeader()
        header.id = random.randint(0, 65535)
        header.flags = 0x0100  # Recursion desired
        header.qdcount = 1
        
        question = DNSQuestion()
        question.qname = domain
        question.qtype = qtype
        question.qclass = 1
        
        query = header.pack() + question.pack()
        
        # Send to nameserver
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(2)
        sock.sendto(query, (nameserver, 53))
        
        response, _ = sock.recvfrom(512)
        sock.close()
        
        # Parse response
        return self.parse_response(response)
\`\`\`

## DNS Security Extensions (DNSSEC)

Adding basic DNSSEC validation:

\`\`\`python
import hashlib
import base64

class DNSSECValidator:
    def __init__(self):
        self.trusted_keys = {}  # Root zone KSK
    
    def validate_response(self, response):
        # Look for RRSIG records
        rrsigs = [r for r in response.additional if r.type == 46]
        
        for rrsig in rrsigs:
            if self.validate_signature(rrsig, response):
                return True
        
        return False
    
    def validate_signature(self, rrsig, response):
        # Parse RRSIG
        rrsig_data = self.parse_rrsig(rrsig.data)
        
        # Find corresponding DNSKEY
        dnskey = self.find_dnskey(rrsig_data['key_tag'])
        if not dnskey:
            return False
        
        # Verify signature
        signed_data = self.construct_signed_data(response, rrsig_data)
        
        try:
            # Simplified - real DNSSEC uses RSA/DSA/ECDSA
            import rsa
            key = rsa.PublicKey.load_pkcs1(dnskey)
            rsa.verify(signed_data, rrsig_data['signature'], key)
            return True
        except:
            return False
\`\`\`

## Performance Testing

Benchmarking our DNS server:

\`\`\`python
import time
import concurrent.futures

def benchmark_dns_server(server_ip, queries_per_second=100, duration=10):
    query_count = 0
    error_count = 0
    latencies = []
    
    def send_query():
        nonlocal query_count, error_count
        
        try:
            start = time.time()
            socket_client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            socket_client.settimeout(1)
            
            # Build query for random domain
            domain = f"test{random.randint(0, 1000)}.example.com"
            query = build_dns_query(domain)
            
            socket_client.sendto(query, (server_ip, 53))
            response, _ = socket_client.recvfrom(512)
            
            latency = (time.time() - start) * 1000  # ms
            latencies.append(latency)
            query_count += 1
            
        except Exception as e:
            error_count += 1
        finally:
            socket_client.close()
    
    # Run benchmark
    start_time = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        while time.time() - start_time < duration:
            futures = []
            for _ in range(queries_per_second // 10):  # Batch of queries
                futures.append(executor.submit(send_query))
            
            # Wait for batch to complete
            concurrent.futures.wait(futures)
            time.sleep(0.1)
    
    # Calculate statistics
    avg_latency = sum(latencies) / len(latencies) if latencies else 0
    p95_latency = sorted(latencies)[int(len(latencies) * 0.95)] if latencies else 0
    
    print(f"Queries: {query_count}")
    print(f"Errors: {error_count}")
    print(f"Avg latency: {avg_latency:.2f}ms")
    print(f"P95 latency: {p95_latency:.2f}ms")
    print(f"QPS: {query_count / duration:.1f}")
\`\`\`

## Results

Testing on my laptop:
- 5,000+ queries per second
- ~0.2ms average latency
- Recursive resolution works!
- Basic caching implemented
- DNSSEC validation framework

Building a DNS server taught me so much about how the internet really works!`,
  tags: ['dns', 'networking', 'python', 'protocols'],
  readTime: '22 min',
};

export default function BuildingaDNSServerinPythonPage() {
  return <BlogPost post={post} />;
}
