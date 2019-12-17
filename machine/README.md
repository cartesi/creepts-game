# Creepts's Cartesi Machine

This is the Cartesi Machine that produces the score given a log for the Creepts
game.

## Getting Started

### Requirements

This prototype uses the cartesi.so library to run the emulator. It also needs
the rootfs.ext2, rom.bin, and kernel.bin files. The building process uses
the `toolchain` Docker image. These are all products of the machine-emulator-sdk repository.

The first step is to create a filesystem with creepts engine and associated tools inside. To do that we use the genext2 tool to create a filesystem with everything that is inside the `fs` folder. Before doing this we must have the latest version of the creepts engine in that folder.

Building Creepts:

```bash
$ npm run build
$ cp dist/djs-verifier-bundle.js machine/fs/bin/
```

Building djs and creeptsfs.ext2:

```bash
$ cd machine
$ make
```
This should produce creeptsfs.ext2.

Cleaning:

```bash
$ make clean
```

## Running Tests

Make sure your environment variables are set so the machine-emulator and its
dependencies can be found. In your development environment, go to the
machine-emulator directory and type

```bash
$ eval $(make env)
```

to set the variables you will need.

Then, copy rootfs.ext2, rom.bin, and kernel.bin to the working directory where
you have creeptsfs.ext2 and creepts.lua.

Now you need to obtain a Brotli compressed, then cpio'd log matching one of the
logs in test/logs. For example:

```bash
$ cd machine
$ ./packlog ../test/logs/log_minimum.json 0.json.br.cpio
$ truncate -s %4096 0.json.br.cpio -- (MacOS: `truncate -s 4096 0.json.br.cpio`)
```

will give you one of the test logs for level 0.

You are finally ready to run the verifier on this log.

```bash
$ ./creepts.lua --log-backing=0.json.br.cpio --level=0 --auto-length
```

This should run the verifier and print a variety of diagnostics information on
the screen:

```
./creepts.lua --log-backing=0.json.br.cpio --level=0 --auto-length

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

[    0.000000] OF: fdt: Ignoring memory range 0x80000000 - 0x80200000
[    0.000000] Linux version 4.20.8 (root@toolchain-env) (gcc version 8.3.0 (crosstool-NG 1.24.0)) #2 SMP Wed Oct 2 19:40:01 UTC 2019
[    0.000000] printk: bootconsole [early0] enabled
Getting log
Getting level
Running verification
Writing results
[    4.590000] reboot: Power down
1140		4628940030
```

In the last line, you can see the score, followed by an empty error message, and
then the value of mcycle.

Run

```bash
$ ./creepts.lua --help
```

for other options.

Read the Lua source for details on the layout of the machine.

## Authors

* *Diego Nehab*

## License

TBD
