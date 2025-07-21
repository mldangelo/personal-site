import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Hadoop at Stanford: Processing Big Data on a Budget',
  description: 'Set up a 50-node Hadoop cluster using old lab computers. Processing terabytes of data for research - on a shoestring budget.',
  keywords: ['hadoop', 'big-data', 'distributed-computing', 'mapreduce'],
  openGraph: {
    title: 'Hadoop at Stanford: Processing Big Data on a Budget',
    description: 'Set up a 50-node Hadoop cluster using old lab computers. Processing terabytes of data for research - on a shoestring budget.',
    type: 'article',
    publishedTime: '2012-10-20',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-10-20',
  title: 'Hadoop at Stanford: Processing Big Data on a Budget',
  content: `Our research group needed to process terabytes of sensor data, but had no budget for a cluster. Solution? Build our own Hadoop cluster from decommissioned lab computers!

## The Hardware Scavenger Hunt

Found goldmine in Stanford surplus:
- 50 Dell OptiPlex towers (circa 2008)
- Core 2 Duo processors
- 4GB RAM each
- 250GB hard drives
- Gigabit ethernet cards

Total cost: $0 (plus pizza for moving help)

## Setting Up the Cluster

First challenge: Installing Hadoop on 50 machines:

\`\`\`bash
#!/bin/bash
# Mass deployment script

NODES="node001 node002 ... node050"
HADOOP_VERSION="1.0.4"

for node in $NODES; do
  echo "Setting up $node"
  
  # Copy Hadoop binaries
  scp hadoop-$HADOOP_VERSION.tar.gz $node:/tmp/
  
  # Install and configure
  ssh $node << 'EOF'
    cd /opt
    tar -xzf /tmp/hadoop-*.tar.gz
    ln -s hadoop-$HADOOP_VERSION hadoop
    
    # Set up environment
    echo 'export HADOOP_HOME=/opt/hadoop' >> ~/.bashrc
    echo 'export PATH=$PATH:$HADOOP_HOME/bin' >> ~/.bashrc
    
    # Configure Hadoop
    cp /shared/configs/core-site.xml $HADOOP_HOME/conf/
    cp /shared/configs/hdfs-site.xml $HADOOP_HOME/conf/
    cp /shared/configs/mapred-site.xml $HADOOP_HOME/conf/
EOF
done
\`\`\`

## Network Configuration

Setting up the private cluster network:

\`\`\`xml
<!-- core-site.xml -->
<configuration>
  <property>
    <name>fs.default.name</name>
    <value>hdfs://master:9000</value>
  </property>
  <property>
    <name>hadoop.tmp.dir</name>
    <value>/data/hadoop/tmp</value>
  </property>
</configuration>

<!-- hdfs-site.xml -->
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>3</value>
  </property>
  <property>
    <name>dfs.name.dir</name>
    <value>/data/hadoop/name</value>
  </property>
  <property>
    <name>dfs.data.dir</name>
    <value>/data/hadoop/data</value>
  </property>
</configuration>
\`\`\`

## Our First MapReduce Job

Analyzing sensor data patterns:

\`\`\`java
public class SensorAnalysis extends Configured implements Tool {
  
  public static class SensorMapper 
      extends Mapper<LongWritable, Text, Text, DoubleWritable> {
    
    private Text sensorId = new Text();
    private DoubleWritable reading = new DoubleWritable();
    
    public void map(LongWritable key, Text value, Context context) 
        throws IOException, InterruptedException {
      
      // Parse CSV: timestamp,sensor_id,temperature,humidity,pressure
      String[] fields = value.toString().split(",");
      
      if (fields.length >= 3) {
        sensorId.set(fields[1]);
        reading.set(Double.parseDouble(fields[2]));
        
        context.write(sensorId, reading);
      }
    }
  }
  
  public static class StatsReducer 
      extends Reducer<Text, DoubleWritable, Text, Text> {
    
    public void reduce(Text key, Iterable<DoubleWritable> values, 
                      Context context) throws IOException, InterruptedException {
      
      double sum = 0;
      double min = Double.MAX_VALUE;
      double max = Double.MIN_VALUE;
      int count = 0;
      
      for (DoubleWritable val : values) {
        double v = val.get();
        sum += v;
        min = Math.min(min, v);
        max = Math.max(max, v);
        count++;
      }
      
      double avg = sum / count;
      String stats = String.format("Avg: %.2f, Min: %.2f, Max: %.2f, Count: %d",
                                  avg, min, max, count);
      
      context.write(key, new Text(stats));
    }
  }
}
\`\`\`

## Performance Tuning

Learned through trial and error:

\`\`\`bash
# JVM heap size for small memory
export HADOOP_HEAPSIZE=512

# Map/Reduce task tuning
<property>
  <name>mapred.map.tasks</name>
  <value>100</value>
</property>

<property>
  <name>mapred.reduce.tasks</name>
  <value>20</value>
</property>

# Optimize for our hardware
<property>
  <name>io.sort.mb</name>
  <value>100</value>
</property>
\`\`\`

## Monitoring the Cluster

Built a simple monitoring dashboard:

\`\`\`python
import subprocess
import json
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/cluster-status')
def cluster_status():
    # Get HDFS stats
    hdfs_report = subprocess.check_output(['hadoop', 'dfsadmin', '-report'])
    
    # Get job stats
    job_list = subprocess.check_output(['hadoop', 'job', '-list'])
    
    # Parse and return
    return render_template('dashboard.html', 
                         hdfs=parse_hdfs_report(hdfs_report),
                         jobs=parse_job_list(job_list))

def parse_hdfs_report(report):
    # Extract live nodes, dead nodes, capacity, etc.
    stats = {}
    for line in report.split('\n'):
        if 'Live datanodes' in line:
            stats['live_nodes'] = int(line.split('(')[1].split(')')[0])
        elif 'DFS Used%' in line:
            stats['usage_percent'] = line.split(':')[1].strip()
    return stats
\`\`\`

## Real Research Results

What we accomplished:
- Processed 5TB of sensor data
- Identified temporal patterns
- Found anomalous sensors
- Generated hourly aggregates
- All for $0 hardware cost

## Challenges and Solutions

Problems we faced:
1. **Node failures**: Built automatic restart scripts
2. **Disk space**: Added external drives to some nodes
3. **Cooling**: Opened windows, added fans
4. **Power**: Had to distribute across circuits
5. **Noise**: Moved cluster to basement

## Lessons Learned

Building a budget cluster taught us:
- Hadoop can run on anything
- Network is often the bottleneck
- Monitoring is essential
- Failures are constant
- Community support is amazing

Our janky cluster processed more data than a $100k server could have. Sometimes constraints breed creativity!`,
  tags: ['hadoop', 'big-data', 'distributed-computing', 'mapreduce'],
  readTime: '18 min',
};

export default function HadoopatStanfordProcessingBigDataonaBudgetPage() {
  return <BlogPost post={post} />;
}
