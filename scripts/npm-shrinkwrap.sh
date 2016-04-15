#!/bin/bash
# Run this when you add a new npm dependency.

pushd `dirname $0`
cd ..
npm prune
npm shrinkwrap --dev
popd
