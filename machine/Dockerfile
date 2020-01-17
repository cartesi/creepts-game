FROM cartesi/machine-emulator:0.1.0

# Install tools
RUN \
    apt-get update \
    && apt-get install -y brotli cpio wget xxd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/cartesi/creepts
ENV PATH="/opt/cartesi/creepts:${PATH}"

# download emulator files
RUN \
    wget https://github.com/cartesi/image-kernel/releases/download/v0.2.0/kernel.bin && \
    wget https://github.com/cartesi/machine-emulator-rom/releases/download/v0.2.0/rom.bin && \
    wget https://github.com/cartesi/image-rootfs/releases/download/v0.2.0/rootfs.ext2

# add creepts filesystem
COPY creeptsfs.ext2 .

# add lua script and utils
COPY creepts.lua .
COPY packlog .
COPY docker-entrypoint.sh .
COPY hashes .

# create drives for level ints
RUN for i in $(seq 0 7); do printf "0: %.16x" $i | xxd -r -g0 >> $i.bin; truncate -s 4k $i.bin; done

# default level.bin is 0 (remove this later)
RUN cp 0.bin level.bin

# default output is also 0
RUN cp 0.bin output.bin

VOLUME /logs

ENTRYPOINT [ "./docker-entrypoint.sh" ]
CMD [ "--level=0" ]
