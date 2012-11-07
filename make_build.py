#!/usr/bin/python
# -*- coding: utf-8 -*-

# required:
# - lessc (apt-get install lessc)

import os
import re
import sys
import glob
import shutil
import datetime

BUILD_DIR = os.path.abspath('./build')
JS_DIR = os.path.join(BUILD_DIR, 'js')
CSS_DIR = os.path.join(BUILD_DIR, 'css')


def bpath(fname):
    """Make absolute path for fname inside BUILD_DIR."""

    return os.path.join(BUILD_DIR, fname)


def clear():
    """Remove all files and dirs from build directory."""

    os.system('rm -r %s/*' % BUILD_DIR)


def copy(sources, destination):
    """Copy sources objects to destination directory."""

    for source in sources:
        os.system('cp -r %s %s' % (source, destination))


def find_files(block_name, fname, type):
    """Find file paths for provided block name."""

    start_marker = '<!--compress:%s:start-->' % block_name
    end_marker = '<!--compress:%s:end-->' % block_name

    source = open(bpath(fname)).read()
    start_pos = source.find(start_marker)
    end_pos = source.find(end_marker) + len(end_marker)

    if type == 'js':
        pattern = r'src="(.*?)"'
    elif type == 'css':
        pattern = r'href="(.*?)"'
    else:
        raise NotImplementedError

    return re.findall(pattern, source[start_pos:end_pos]), start_pos, end_pos


def replace_block(start_pos, end_pos, source_fname, type, destination_fname):
    """Modify part of content of source_fname dependent on type."""

    content = open(bpath(source_fname)).read()

    if type == 'js':
        replace_to = '<script src="%s"></script>' % destination_fname
    elif type == 'css':
        replace_to = '<link href="%s" rel="stylesheet" media="all" />' % destination_fname
    else:
        raise NotImplementedError

    content = content.replace(content[start_pos:end_pos], replace_to)
    with open(bpath(source_fname), 'w') as result:
        result.write(content)


def remove_debug_blocks():
    """Remove debug blocks from sources."""

    start_marker = '<!--debug:start-->'
    end_marker = '<!--debug:end-->'

    index_source = open(bpath('index.html')).read()
    start = index_source.find(start_marker)
    end = index_source.find(end_marker) + len(end_marker)
    index_source = index_source.replace(index_source[start:end], '')
    
    with open(bpath('index.html'), 'w') as result:
        result.write(index_source)


def add_manifest():
    """Adds cache.manifest file."""

    index_source = open(bpath('index.html')).read()
    index_source = index_source.replace('<html>', '<html manifest="cache.manifest">')

    with open(bpath('index.html'), 'w') as result:
        result.write(index_source)


def update_manifest():
    """Update manifest date."""

    manifest_source = open(bpath('cache.manifest')).read()
    replace_to = 'CACHE MANIFEST\n%s' % datetime.datetime.now()
    manifest_source = manifest_source.replace('CACHE MANIFEST', replace_to)

    with open(bpath('cache.manifest'), 'w') as result:
        result.write(manifest_source)


def compress_js(files_to_compress, target_fname):
    """Concatenate JavaScript files into one file and compress it."""

    compress_to = bpath(target_fname)

    target = open(compress_to, 'w')
    for fname in files_to_compress:
        target.write(open(os.path.abspath(fname)).read())
    target.close()

    os.system('java -jar yuicompressor.jar --type=js %s -o %s' % (compress_to, compress_to))

    os.system('rm -r %s' % JS_DIR)


def compress_css(target_fname):
    """Concatenate CSS files into one file and compress it."""

    compress_to = bpath(target_fname)

    os.system('lessc %s > %s' % ('css/styles.less', compress_to))
    os.system('java -jar yuicompressor.jar --type=css %s -o %s' % (compress_to, compress_to))

    os.system('rm -r %s/*.less' % CSS_DIR)


def remove_prints(top):
    """Remove logs statements from source."""

    for root, dirs, files in os.walk(top):
        for fname in glob.glob("%s/*.js" % root):
            content = open(fname).read()
            with open(fname, 'w') as result:
                result.write(re.sub(r'(app\.utils\.log.*?\);?)', '', content))

def make_zip():
    """Creating ZIP archive with sources."""

    shutil.make_archive(base_name="build", format="zip", root_dir=BUILD_DIR)
    os.system('mv %s %s' % ('build.zip', BUILD_DIR))


def main(args):
    print 'Clearing build dir...'
    clear()

    print 'Copying sources...'
    copy(['css', 'img', 'js', '*.png', 'index.html', 'config.xml', 'cache.manifest'], BUILD_DIR)

    print 'Compressing JavaScript...'
    files, start, end = find_files('js', 'index.html', 'js')
    replace_block(start, end, 'index.html', 'js', 'app.js')
    compress_js(files, 'app.js')

    print 'Compressing CSS...'
    files, start, end = find_files('css', 'index.html', 'css')
    replace_block(start, end, 'index.html', 'css', 'css/styles.css')
    compress_css('css/styles.css')

    print 'Removing debug blocks...'
    remove_debug_blocks()

    #print 'Adding manifest...'
    #add_manifest()

    print 'Update manifest...'
    update_manifest()

    print 'Removing prints...'
    remove_prints(BUILD_DIR)

    print 'Building archive...'
    make_zip()


if __name__ == "__main__":
    sys.exit(main(sys.argv))
