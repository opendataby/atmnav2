import os
import sys
import re

FILE_EXTENSIONS = [
    '.less',
]

START_PATTERN = re.compile(r'/\*\* base64:start \"(.*)\" \*/')
END_PATTERN = re.compile(r'/\*\* base64:end \*/')

DATA_MIMITYPES = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpe': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.otf': 'application/x-font-opentype',
    '.ttf': 'application/x-font-truetype',
    '.woff': 'application/x-font-woff',
    '.eot': 'application/vnd.ms-fontobject',
}

DATA_TEMPLATE = 'data:%s;base64,%s'

def check_file(file_name):
    for file_extension in FILE_EXTENSIONS:
        if file_name[-len(file_extension):].lower() == file_extension:
            return True
    return False

def get_data_uri(file_name):
    data_mimitype = None
    for file_extension in DATA_MIMITYPES:
        if file_name[-len(file_extension):].lower() == file_extension:
            data_mimitype = DATA_MIMITYPES[file_extension]
            break
    if not data_mimitype:
        raise Exception('unknown file mimitype')
    with open(file_name, 'rb') as resource_file:
        encoded_data = resource_file.read().encode('base64').replace('\n', '')
        return DATA_TEMPLATE % (data_mimitype, encoded_data)

def replace_urls_to_base64(path, delete_resources=False):
    for root, dir_names, file_names in os.walk(path):
        for file_name in filter(check_file, file_names):
            full_file_name = os.path.join(root, file_name)
            result = []
            processing = False
            resource_path = None
            resource_data_uri = None
            with open(full_file_name, 'rb') as processing_file:
                for line in processing_file.readlines():
                    match = START_PATTERN.search(line)
                    if match and len(match.regs) == 2:
                        processing = True
                        resource_path = match.string[match.regs[1][0]:match.regs[1][1]]
                        resource_full_path = os.path.join(root, resource_path)
                        resource_data_uri = get_data_uri(resource_full_path)
                        if delete_resources:
                            os.remove(resource_full_path)
                        continue
                    if processing:
                        match = END_PATTERN.search(line)
                        if match:
                            processing = False
                            continue
                        result.append(line.replace(resource_path, resource_data_uri))
                        continue
                    result.append(line)

            with open(full_file_name, 'wb') as file:
                file.writelines(result)

if __name__ == '__main__':
    path = '.'
    if len(sys.argv) > 1:
        path = sys.argv[1]
    replace_urls_to_base64(path)