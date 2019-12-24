# Copyright 2019 Cartesi Pte. Ltd.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under
# the License.
#

UNAME:=$(shell uname)

# Containers tags
TOOLCHAIN_TAG ?= 0.2.0

FSDIR := fs
DEPDIR := third-party
SRCDIR := $(abspath src)
DOWNLOADDIR := $(DEPDIR)/downloads
BUILDDIR := build

CONTAINER_BASE := /opt/cartesi/creepts-dapp
CONTAINER_MAKE := /usr/bin/make

RVCC  = riscv64-unknown-linux-gnu-gcc
RVCXX = riscv64-unknown-linux-gnu-g++
RVCOPY = riscv64-unknown-linux-gnu-objcopy
RVDUMP = riscv64-unknown-linux-gnu-objdump
RISCV_CFLAGS :=-march=rv64ima -mabi=lp64

DJSDIR = $(DEPDIR)/duktape-2.4.0
DJS = $(DJSDIR)/djs
VIMDIR = $(DEPDIR)/vim-8.1.2069
QJSDIR = $(DEPDIR)/quickjs-2019-12-21
QJS = $(QJSDIR)/qjs
QJSDBG = $(QJSDIR)/qjs-debug
XXDDIR = $(VIMDIR)/src/xxd
XXD = $(XXDDIR)/xxd
FSDIR = fs

DEPDIRS := $(DJSDIR) $(VIMDIR) $(QJSDIR)

all: fs

time-both: fs
	time cartesi-machine.lua --batch --fs-backing=creeptsfs.ext2 --cmdline='quiet -- /mnt/fs/bin/qjs --std /mnt/fs/bin/qjs-verifier-bundle.js /mnt/fs/logs/log_short.json /mnt/fs/levels/0.json'
	time cartesi-machine.lua --batch --fs-backing=creeptsfs.ext2 --cmdline='quiet -- /mnt/fs/bin/djs /mnt/fs/bin/djs-verifier-bundle.js /mnt/fs/logs/log_short.json /mnt/fs/levels/0.json'

test-qjs: fs
	cartesi-machine.lua --batch --fs-backing=creeptsfs.ext2 --cmdline='quiet -- /mnt/fs/bin/qjs --std /mnt/fs/bin/qjs-verifier-bundle.js /mnt/fs/logs/log_short.json /mnt/fs/levels/0.json' | tee in
	./qjs --std fs/bin/qjs-verifier-bundle.js fs/logs/log_short.json fs/levels/0.json | tee out

test-djs: fs
	cartesi-machine.lua --batch --fs-backing=creeptsfs.ext2 --cmdline='quiet -- /mnt/fs/bin/djs /mnt/fs/bin/djs-verifier-bundle.js /mnt/fs/logs/log_short.json /mnt/fs/levels/0.json' | tee in
	./djs fs/bin/djs-verifier-bundle.js fs/logs/log_short.json fs/levels/0.json | tee out

fs: creeptsfs.ext2

#creeptsfs.ext2: $(FSDIR)/bin/qjs  $(FSDIR)/bin/qjs-debug $(FSDIR)/bin/djs $(FSDIR)/bin/xxd $(FSDIR)/levels
creeptsfs.ext2: $(FSDIR)/bin/qjs $(FSDIR)/bin/djs $(FSDIR)/bin/xxd $(FSDIR)/levels
	$(MAKE) toolchain-exec CONTAINER_COMMAND="$(CONTAINER_MAKE) $@.toolchain"

$(FSDIR)/bin/djs: $(DJS)
	cp -f $< $@

$(DJS): $(DEPDIR)/duktape-2.4.0
	$(MAKE) toolchain-exec CONTAINER_COMMAND="$(CONTAINER_MAKE) $@.toolchain"

$(BUILDDIR)/djs: $(DEPDIR)/duktape-2.4.0
	mkdir -p $(BUILDDIR)
	rm -f $(DJS) &&	$(MAKE) -C $(DJSDIR) -f Makefile.djs
	cp -f $(DJS) $@

djs: $(BUILDDIR)/djs

djs.clean:
	rm -f $(BUILDDIR)/djs

$(DJS).toolchain:
	$(MAKE) -C $(DJSDIR) -f Makefile.djs CC=$(RVCC)

$(FSDIR)/bin/xxd: $(XXD)
	cp -f $< $@

$(FSDIR)/bin/qjs: $(QJS)
	cp -f $< $@

$(FSDIR)/bin/qjs-debug: $(QJSDBG)
	cp -f $< $@

$(FSDIR)/levels:
	mkdir -p $@
	cd .. && npm run levels -- -d machine/fs/levels -n

$(QJS): $(DEPDIR)/quickjs-2019-12-21
	$(MAKE) toolchain-exec CONTAINER_COMMAND="$(CONTAINER_MAKE) $@.toolchain"

$(QJSDBG): $(DEPDIR)/quickjs-2019-12-21 | $(QJS)
	$(MAKE) toolchain-exec CONTAINER_COMMAND="$(CONTAINER_MAKE) $@.toolchain"

$(XXD): $(DEPDIR)/vim-8.1.2069
	$(MAKE) toolchain-exec CONTAINER_COMMAND="$(CONTAINER_MAKE) $@.toolchain"

$(XXD).toolchain:
	$(MAKE) -C $(XXDDIR) CC=$(RVCC)

$(QJS).toolchain:
	$(MAKE) -C $(QJSDIR) CROSS_PREFIX=riscv64-unknown-linux-gnu- qjs

$(QJSDBG).toolchain:
	$(MAKE) -C $(QJSDIR) CROSS_PREFIX=riscv64-unknown-linux-gnu- qjs-debug

creeptsfs.ext2.toolchain:
	genext2fs -f -b 40960 -d fs $(basename $@)
	truncate -s %4096 $(basename $@)

$(DEPDIR)/vim-8.1.2069: | downloads
	tar -xzvf $(DOWNLOADDIR)/v8.1.2069.tar.gz -C $(DEPDIR) vim-8.1.2069/src/xxd

$(DEPDIR)/duktape-2.4.0: | downloads
	tar -xJvf $(DOWNLOADDIR)/duktape-2.4.0.tar.xz -C $(DEPDIR)
	cd $@ && patch -p1 < ../duktape-2.4.0.patch

$(DEPDIR)/quickjs-2019-12-21: | downloads
	tar -xJvf $(DOWNLOADDIR)/quickjs-2019-12-21.tar.xz -C $(DEPDIR)
	cd $@ && patch -p1 < ../quickjs-2019-12-21.patch

downloads:
	mkdir -p $(DOWNLOADDIR)
	wget -nc -i $(DEPDIR)/dependencies -P $(DOWNLOADDIR)
	cd $(DEPDIR) && shasum -c shasumfile

toolchain-exec:
	@docker run --hostname $@ --rm \
		-e USER=$$(id -u -n) \
		-e GROUP=$$(id -g -n) \
		-e UID=$$(id -u) \
		-e GID=$$(id -g) \
		-v `pwd`:$(CONTAINER_BASE) \
		-w $(CONTAINER_BASE) \
		cartesi/toolchain:$(TOOLCHAIN_TAG) $(CONTAINER_COMMAND)

toolchain-env:
	@docker run --hostname toolchain-env -it --rm \
		-e USER=$$(id -u -n) \
		-e GROUP=$$(id -g -n) \
		-e UID=$$(id -u) \
		-e GID=$$(id -g) \
		-v `pwd`:$(CONTAINER_BASE) \
		-w $(CONTAINER_BASE) \
		cartesi/toolchain:$(TOOLCHAIN_TAG)

clean:
	\rm -rf creeptsfs.ext2 $(DJS) $(FSDIR)/bin/djs $(FSDIR)/bin/xxd $(FSDIR)/levels $(XXD) $(DOWNLOADDIR) $(DEPDIRS) $(BUILDDIR)

.PHONY: toolchain-exec djs build-djs xxd build-xxd clean downloads $(XXD).toolchain $(DJS).toolchain creeptsfs.ext2.toolchain
