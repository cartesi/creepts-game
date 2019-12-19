FROM cartesi/machine-emulator:0.1.0-rc3

# Install tools
RUN \
    apt-get update \
    && apt-get install -y brotli cpio wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/cartesi/creepts

RUN \
    wget --no-verbose https://github.com/cartesi/image-kernel/releases/download/v0.1.0/kernel.bin && \
    wget --no-verbose https://github.com/cartesi/machine-emulator-rom/releases/download/v0.1.0/rom.bin && \
    wget --no-verbose https://github.com/cartesi/image-rootfs/releases/download/v0.1.0/rootfs.ext2

COPY creeptsfs.ext2 .
COPY creepts.lua .
COPY packlog .
COPY docker-entrypoint.sh .

VOLUME /logs

ENTRYPOINT [ "./docker-entrypoint.sh" ]
