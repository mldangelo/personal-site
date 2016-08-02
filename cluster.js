import cluster from 'cluster';

const workers = process.env.WORKERS || 1;

if (cluster.isMaster) {

	console.log('start cluster with %s workers', workers);

	for (let i = 0; i < workers; ++i) {
		var worker = cluster.fork().process;
		console.log('worker %s started.', worker.pid);
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log('worker %d died (%s). restarting...',
			worker.process.pid, signal || code);
		cluster.fork();
	});

} else {
	require('./server.js');
}

process.on('uncaughtException', (err) => {
	console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
	console.error(err.stack);
	process.exit(1);
});
