#!/bin/sh

log="log.json"
log_backing=$log.br.cpio

# write stdin to file $log
dd of=$log

# brotli and cpio the log file
echo "Creating log drive for $log at $log_backing"
./packlog $log $log_backing

# truncate file to 1 megabyte
echo "Truncating $log_backing to 1 megabyte"
truncate -s 1m $log_backing

# print the hash of file
echo "Generating hash"
cartesi-machine-hash --input=$log_backing --page-log2-size=10 --tree-log2-size=20

echo "Running emulator"
# run the emulator
./creepts.lua --auto-length --log-backing=$log_backing $@
