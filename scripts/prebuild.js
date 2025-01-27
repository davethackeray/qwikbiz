const ps = require('ps-node');
const { promisify } = require('util');
const psLookup = promisify(ps.lookup);
const psKill = promisify(ps.kill);

const PORTS = [3000, 5555]; // Next.js and Prisma Studio ports
const PROCESS_NAMES = {
  3000: 'Next.js',
  5555: 'Prisma Studio'
};

function findProcessByPort(port) {
  return psLookup({
    command: new RegExp(`${port}`)
  });
}

async function killProcess(process) {
  try {
    await psKill(process.pid);
    return true;
  } catch (error) {
    console.error(`Failed to kill process ${process.pid}:`, error.message);
    return false;
  }
}

async function checkAndKillProcesses() {
  try {
    for (const port of PORTS) {
      console.log(`\nChecking for processes on port ${port} (${PROCESS_NAMES[port]})...`);
      const processes = await findProcessByPort(port);
      
      if (processes.length > 0) {
        console.log(`Found ${processes.length} process(es) using port ${port}:`);
        
        for (const process of processes) {
          console.log(`- PID: ${process.pid}, Command: ${process.command}`);
          
          const response = await new Promise(resolve => {
            process.stdout.write(`Do you want to kill this process? (y/N): `);
            process.stdin.once('data', data => {
              resolve(data.toString().trim().toLowerCase());
            });
          });

          if (response === 'y') {
            const killed = await killProcess(process);
            if (killed) {
              console.log(`✓ Process ${process.pid} killed successfully`);
            } else {
              console.log(`✗ Failed to kill process ${process.pid}`);
              process.exit(1);
            }
          } else {
            console.log('Skipping process termination.');
            process.exit(1);
          }
        }
      } else {
        console.log(`✓ No processes found on port ${port}`);
      }
    }
    
    console.log('\n✓ Port check completed successfully\n');
  } catch (error) {
    console.error('Error checking processes:', error.message);
    process.exit(1);
  }
}

// Run the port check
checkAndKillProcesses();
