#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import re
import sys

BUILD_DIR = os.path.abspath('./build')
JS_DIR = os.path.join(BUILD_DIR, 'js')


def clear():
    """Remove all files and dirs from build directory."""

    os.system('rm -r %s/*' % BUILD_DIR)


def copy(sources, destination):
    """Copy sources objects to destination directory."""

    for source in sources:
        os.system('cp -r %s %s' % (source, destination))


def find_files(block_name, fname):
    """Find file paths for provided block name."""

    start_marker = '<!--compress:%s:start-->' % block_name
    end_marker = '<!--compress:%s:end-->' % block_name

    source = open(os.path.join(BUILD_DIR, fname)).read()
    start_pos = source.find(start_marker)
    end_pos = source.find(end_marker) + len(end_marker)

    return re.findall(r'src="(.*?)"', source[start_pos:end_pos]), start_pos, end_pos


def replace_block(start_pos, end_pos, source_fname, type, destination_fname):
    """Modify part of content of source_fname dependent on type."""

    content = open(os.path.join(BUILD_DIR, source_fname)).read()

    if type == 'js':
        replace_to = '<script src="%s"></script>' % destination_fname

    content = content.replace(content[start_pos:end_pos], replace_to)
    with open(os.path.join(BUILD_DIR, source_fname), 'w') as result:
        result.write(content)


def compress_js(files_to_compress, target_fname):
    """Concatenate JavaScript files into one file and compress it."""

    compress_to = os.path.join(BUILD_DIR, target_fname)

    target = open(compress_to, 'w')
    for fname in files_to_compress:
        target.write(open(os.path.abspath(fname)).read())
    target.close()

    os.system('java -jar yuicompressor.jar --type=js %s -o %s' % (compress_to, compress_to))

    os.system('rm -r %s' % JS_DIR)


def compress_css():
    pass

def make_zip():
    pass


def main(args):
    clear()
    copy(['css', 'img', 'js', '*.png', 'index.html', 'config.xml'], BUILD_DIR)

    files, start, end = find_files('js', 'index.html')
    replace_block(start, end, 'index.html', 'js', 'libs.js')
    compress_js(files, 'libs.js')

    #compress_css()
    #make_zip()


if __name__ == "__main__":
    sys.exit(main(sys.argv))