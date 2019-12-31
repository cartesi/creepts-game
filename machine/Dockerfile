FROM cartesi/machine-emulator:0.1.0-rc4

# Install tools
RUN \
    apt-get update \
    && apt-get install -y brotli cpio wget xxd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/cartesi/creepts

RUN \
    wget --no-verbose https://github.com/cartesi/image-kernel/releases/download/v0.2.0/kernel.bin && \
    wget --no-verbose https://github.com/cartesi/machine-emulator-rom/releases/download/v0.2.0/rom.bin && \
    wget --no-verbose https://github.com/cartesi/image-rootfs/releases/download/v0.2.0/rootfs.ext2

COPY creeptsfs.ext2 .
COPY creepts.lua .
COPY packlog .
COPY docker-entrypoint.sh .

# create drives for level ints
RUN for i in $(seq 0 7); do printf "0: %.16x" $i | xxd -r -g0 >> $i.ext2; truncate -s 4k $i.ext2; done

# default level.ext2 is 0 (remove this later)
RUN cp 0.ext2 level.ext2

# default output is also 0
RUN cp 0.ext2 output.ext2

VOLUME /logs

ENTRYPOINT [ "./docker-entrypoint.sh" ]
