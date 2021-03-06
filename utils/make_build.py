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
import commands

from optparse import OptionParser
from base64util import replace_urls_to_base64

VERSION = '0.1'
SUPPORTED_PLATFORMS = ('android', 'ios', 'desktop')
PHONEGAP_API_URL = 'https://build.phonegap.com/api/v1/apps/79182'

SRC_DIR = os.path.abspath('..')
BUILD_DIR = os.path.abspath('../build')
JS_DIR = os.path.join(BUILD_DIR, 'js')
CSS_DIR = os.path.join(BUILD_DIR, 'css')

SOURCES_TYPES = (
    '.js',
    '.css',
    '.less',
    '.html',
)


def bpath(fname):
    """Make absolute path for fname inside BUILD_DIR."""

    return os.path.join(BUILD_DIR, fname)


def clear():
    """Remove all files and dirs from build directory."""

    os.system('rm -r %s/*' % BUILD_DIR)


def copy(sources, sources_dir,  destination_dir):
    """Copy sources objects to destination directory."""

    if not os.path.exists(destination_dir):
        os.makedirs(destination_dir)

    for source in sources:
        os.system('cp -r %s %s' % (os.path.join(sources_dir, source), destination_dir))


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


def compress_html():
    markers = (
        ('<!--', '-->'),
        ('/*', '*/'),
    )

    source = open(bpath('index.html')).read()
    for start_marker, end_marker in markers:
        while True:
            start = source.find(start_marker)
            if start == -1:
                break
            end = source.find(end_marker, start + 1) + len(end_marker)
            source = source.replace(source[start:end], '')

        with open(bpath('index.html'), 'w') as result:
            for line in source.splitlines():
                line = line.strip()
                result.write(line)


def remove_blocks(path, block):
    """Remove blocks from sources
       which starts with: /** <block>:start */
               ends with: /** <block>:end */
    """
    start_marker = '/** %s:start */' % block
    end_marker = '/** %s:end */' % block

    for root, dirs, files in os.walk(path):
        for file in map(lambda file: os.path.join(root, file), files):
            if not file.endswith(SOURCES_TYPES):
                continue
            source = open(file).read()
            while True:
                start = source.find(start_marker)
                if start == -1:
                    break
                end = source.find(end_marker, start + 1) + len(end_marker)
                source = source.replace(source[start:end], '')

            with open(file, 'w') as result:
                result.write(source)


def remove_debug_blocks():
    remove_blocks(BUILD_DIR, 'debug')


def remove_unused_blocks():
    remove_blocks(BUILD_DIR, 'unused')


def remove_non_android_blocks():
    remove_blocks(BUILD_DIR, 'phonegap-non-android')


def remove_non_ios_blocks():
    remove_blocks(BUILD_DIR, 'phonegap-non-ios')


def remove_phonegap_blocks():
    remove_blocks(BUILD_DIR, 'phonegap')


def remove_unused_vendor_css_prefixes(prefix):
    css_vendor_prefixes = (
        '-webkit-',
        '-khtml-',
        '-moz-',
        '-ms-',
        '-o-',
    )

    for root, dirs, files in os.walk(CSS_DIR):
        for file in map(lambda file: os.path.join(root, file), files):
            if not file.endswith(SOURCES_TYPES):
                continue
            source = open(file).read()
            with open(file, 'w') as result:
                for line in source.splitlines():
                    has_prefix = False
                    for vendor_prefix in css_vendor_prefixes:
                        if vendor_prefix in line:
                            has_prefix = True
                            break
                    if has_prefix and prefix not in line:
                        continue
                    result.write(line)
                    result.write('\n')


def set_debug_false():
    """Change debug setting to false"""

    settings_source = open(bpath('js/settings.js')).read()
    settings_source = settings_source.replace('debug: true', 'debug: false')

    with open(bpath('js/settings.js'), 'w') as result:
        result.write(settings_source)


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
        target.write(open(bpath(fname)).read())
    target.close()

    os.system('java -jar yuicompressor.jar --type=js %s -o %s' % (compress_to, compress_to))

    os.system('rm -r %s' % JS_DIR)


def compress_css(target_fname):
    """Concatenate CSS files into one file and compress it."""

    compress_to = bpath(target_fname)
    replace_urls_to_base64(bpath('css'), True)
    os.system('lessc %s > %s' % (bpath('css/styles.less'), compress_to))
    os.system('java -jar yuicompressor.jar --type=css %s -o %s' % (compress_to, compress_to))

    os.system('rm -r %s/*.less' % CSS_DIR)


def remove_prints(top):
    """Remove logs statements from source."""

    for root, dirs, files in os.walk(top):
        for fname in glob.glob("%s/*.js" % root):
            content = open(fname).read()
            with open(fname, 'w') as result:
                result.write(re.sub(r'(app\.utils\.log.*?\);?)', '', content))


def remove_empty_dirs(path):
    for root, dirs, files in os.walk(path):
        if not dirs and not files:
            os.removedirs(root)

def make_zip():
    """Creating ZIP archive with sources."""

    shutil.make_archive(base_name="build", format="zip", root_dir=BUILD_DIR)
    os.system('mv %s %s' % ('build.zip', BUILD_DIR))


def upload_build():
    """Upload build to PhoneGap build service."""

    if not os.path.exists('./auth'):
        print ('WARNING: Unable to upload build. auth file not found. '
               'Set your credentials in auth file (username,password)')
        return

    fname = bpath('build.zip')
    user, password = open('./auth').read().strip().split(',')
    result = commands.getoutput('curl -u %s:%s -X PUT -F file=@%s %s' % (user, password, fname, PHONEGAP_API_URL))

    if not '"error":{}' in result:
        print result
    else:
        print 'Build uploaded'


def main(options):
    print 'Clearing build dir...'
    clear()

    print 'Copying sources...'
    copy(['css', 'img', 'js', 'index.html'], SRC_DIR, BUILD_DIR)
    if options.platform == 'desktop':
        copy(['app.yaml', 'humans.txt', 'robots.txt', 'LICENSE.txt'], SRC_DIR, BUILD_DIR)
    else:
        copy(['*.png', 'config.xml'], SRC_DIR, BUILD_DIR)

    print 'Removing prints...'
    remove_prints(BUILD_DIR)

    print 'Removing debug blocks...'
    remove_debug_blocks()

    print 'Removing unused blocks...'
    remove_unused_blocks()

    if options.platform == 'desktop':
        print 'Removing phonegap blocks...'
        remove_phonegap_blocks()
    elif options.platform == 'android':
        print 'Removing non android blocks...'
        remove_non_android_blocks()
        remove_unused_vendor_css_prefixes('-webkit-')
    elif options.platform == 'ios':
        print 'Removing non ios blocks...'
        remove_non_ios_blocks()
        remove_unused_vendor_css_prefixes('-webkit-')

    print 'Set debug false'
    set_debug_false()

    print 'Compressing JavaScript...'
    files, start, end = find_files('js', 'index.html', 'js')
    replace_block(start, end, 'index.html', 'js', 'app.js')
    compress_js(files, 'app.js')

    print 'Compressing CSS...'
    files, start, end = find_files('css', 'index.html', 'css')
    replace_block(start, end, 'index.html', 'css', 'css/styles.css')
    compress_css('css/styles.css')

    print 'Compressing HTML...'
    compress_html()

    #print 'Adding manifest...'
    #add_manifest()

    #print 'Update manifest...'
    #update_manifest()

    print 'Remove empty dirs...'
    remove_empty_dirs(BUILD_DIR)

    print 'Building archive...'
    make_zip()

    if options.upload:
        print 'Uploading build to PhoneGap build service...'
        upload_build()


def get_parser():
    parser = OptionParser(usage='usage: %prog [options]', version=VERSION)
    parser.add_option('-p', '--platform', action='store', type='string',
                        default='android', help='platform to make build for: android, ios or desktop')
    parser.add_option('--upload', action='store_true', help='upload file to PhoneGap build service')

    return parser


if __name__ == "__main__":
    parser = get_parser()
    options, args = parser.parse_args()

    if options.platform not in SUPPORTED_PLATFORMS:
        parser.error('Unsupported platform type: %s' % options.platform)

    sys.exit(main(options))
