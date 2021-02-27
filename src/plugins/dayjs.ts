import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/ar';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/id';
import 'dayjs/locale/it';
import 'dayjs/locale/ja';
import 'dayjs/locale/my';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/tr';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
