const { spawnSync, execSync } = require('child_process');
const path = require('path');

const getLsblk = () => {
  let lsblk = execSync('lsblk --json -o NAME,PATH,SIZE,MODEL,PARTLABEL,MODEL,FSTYPE,MOUNTPOINT,TYPE');
  lsblk = lsblk.toString();
  lsblk = JSON.parse(lsblk);
  
  let loops = lsblk.blockdevices.filter(f => f.type === 'loop').map(m => m.mountpoint);
  lsblk = lsblk.blockdevices.filter(f => f.children && f.children.map(m => m.fstype).includes('BitLocker'));
  lsblk = lsblk.map(m => ({ ...m, children: m.children.filter(f => f.fstype == 'BitLocker').map(m => ({ ...m, mounted: loops.includes(`/media/bitlockermount-${m.name}`) })) }));

  return lsblk;

  // return JSON.parse('[{"name":"sdb","path":"/dev/sdb","size":"57.7G","model":"Patriot_Memory","partlabel":null,"fstype":null,"mountpoint":null,"type":"disk","children":[{"name":"sdb1","path":"/dev/sdb1","size":"57.7G","model":null,"partlabel":null,"fstype":"BitLocker","mountpoint":null,"type":"part","mounted":false}]},{"name":"sdc","path":"/dev/sdc","size":"476.9G","model":"My_Passport_25F3","partlabel":null,"fstype":null,"mountpoint":null,"type":"disk","children":[{"name":"sdc1","path":"/dev/sdc1","size":"476.9G","model":null,"partlabel":"My Passport","fstype":"BitLocker","mountpoint":null,"type":"part","mounted":false}]}]');
}

const mount = (drive, unlockPass) => {
  try {
    const name = drive.substring(drive.lastIndexOf('/') + 1);
    const bitlockerMountDir = `/media/bitlockermount-${name}`;

    // Check if already mounted
    let loops = execSync('lsblk -I 7 --json -o MOUNTPOINT');
    loops = JSON.parse(loops.toString());
    const mountpoints = loops.blockdevices.map(m => m.mountpoint)
    if (mountpoints.includes(bitlockerMountDir)) {
      return 'Drive is already mounted';
    }

    let res = spawnSync('pkexec', ['sudo', `${path.join(__dirname, 'mount.sh')}`, `${name}`, `${drive}`, `${unlockPass}`]);
    if (res.stdout.toString().indexOf('None of the provided decryption mean is decrypting the keys. Abort.') > -1) {
      return 'Incorrect BitLocker password';
    }
    if (res.stderr.length > 0) {
      return res.stderr.toString();
    }
    return res.stdout.toString();
  } catch (err) {
    return err.message;
  }
}

const unmount = (name) => {
  try {
    const res = spawnSync('pkexec', [ 'sudo', `${path.join(__dirname, 'unmount.sh')}`, name]);
    if (res.stderr.length > 0) {
      return res.stderr.toString();
    }
    return res.stdout.toString();
  } catch (err) {
    return err.message;
  }
};
