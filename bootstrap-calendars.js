/*
   Bootstrap-Calendars
   Written by Faris Alsalama December 2015
   The MIT License (MIT)
*/

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
        module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        global.moment = factory()
}(this, function() {
    'use strict';

    function CTime(hour, minute, second) {
        this._hour = hour;
        this._minute = minute;
        this._second = second;
        this._bubble = 0;
    }

    $.extend(CTime.prototype, {

        set: function(length, unit) {
            var h = unit === 'h' ? length : this._hour;
            var m = unit === 'm' ? length : this._minute;
            var s = unit === 's' ? length : this._second;
            if (s < 0 || s >= 60) {
                m += Math.floor(s / 60);
                s = s % 60;
                s = (s < 0) ? s + 60 : s;
            }
            if (m < 0 || m >= 60) {
                h += Math.floor(m / 60);
                m = m % 60;
                m = (m < 0) ? m + 60 : m;
            }
            if (h < 0 || h >= 24) {
                this._bubble = Math.floor(h / 24);
                h = h % 24;
                h = (h < 0) ? h + 24 : h;
            }
            this.validate(h, m, s);
            this._hour = h;
            this._minute = m;
            this._second = s;

            return this;
        },

        add: function(length, unit) {
            var v = unit === 'h' ? this._hour + length :
                unit === 'm' ? this._minute + length :
                unit === 's' ? this._second + length : 0;
            return this.set(v, unit);
        },

        validate: function(hour, minute, second) {
            var error = hour < 0 || hour > 24 || (hour === 24 &&
                    (minute !== 0 || second !== 0 || millisecond !== 0)) ? true :
                    minute < 0 || minute > 59 ? true :
                    second < 0 || second > 59 ? true : false;
            if (error) {
                throw "Invalid time: {0}:{1}:{2} {4}".replace(/\{0\}/, hour).replace(/\{1\}/, minute).replace(/\{2\}/, second);

            }
        },

        compareTo: function(time2) {
            return this._hour > time2._hour ? 1 : this._hour < time2._hour ? -1 :
                this._minute > time2._minute ? 1 : this._minute < time2._minute ? -1 :
                this._second > time2._second ? 1 : this._second < time2._second ? -1 : 0;
        }
    });

    function CDateTime(date, time) {
        this._date = typeof date === 'undefined' ? $.calendars.instance().today() : date;
        this._time = typeof time === 'undefined' ? new CTime(0, 0, 0) : time;
        this._isCDateTime = true;
    }

    function clone() {
        var date = this._date.newDate();
        var time = new CTime();
        $.extend(time, this._time);

        return new CDateTime(date, time);
    }

    function locale(locale) {
        if (arguments.length === 0 || locale.lang === undefined) return this;
        var cal = $.calendars.instance(locale.calender, locale.lang);
        this._date = cal.isValid(this._date.year(), this._date.month(), this._date.day()) ?
            cal.newDate(this._date.year(), this._date.month(), this._date.day()) :
            cal.today();

        return this;
    }

    function localeData(locale) {
        return this;
    }

    function longDateFormat(locale) {
        return this._map_specifiers(locale);
    }

    function date(d) {
        if (arguments.length === 0)
            return this._date;
        else
            this.day(d);

        return this;
    }

    function second(s) {
        return arguments.length === 0 ? this._time._second : this._time._second = s;
    }

    function minute(m) {
        if (arguments.length === 0)
            return this._time._minute;
        this._time._minute = m;

        return this;
    }

    function hour(h) {
        if (arguments.length === 0)
            return this._time._hour;
        this._time._hour = h;

        return this;
    }

    function day(d) {
        return arguments.length === 0 ? this._date.day() : this._date.day(d);
    }

    function month(m) {
        if (arguments.length === 0)
            return this._date.month() - 1;
        this._date.month(m + 1);

        return this;
    }

    function weekday() {
        return this._date.dayOfWeek();
    }

    function year(y) {
        return arguments.length === 0 ? this._date.year() : this._date.year(y);
    }

    function add(length, unit) {
        switch (unit) {
            case 'M':
                this._date.add(length, 'm');
                break;
            case 'y':
            case 'w':
            case 'd':
                this._date.add(length, unit);
                break;
            case 'h':
            case 'm':
            case 's':
                this._time.add(length, unit);
                if (this._time._bubble !== 0) {
                    this._date.add(this._time._bubble, 'd');
                    this._time._bubble = 0;
                }
                break;
        }

        return this;
    }

    function subtract(length, unit) {
        return this.add(-length, unit);
    }

    function startOf(unit) {
        switch (unit) {
            case 'y':
                this._date.month(1);
            case 'M':
                this._date.day(1);
            case 'w':
            case 'd':
                this._time._hour = 0;
            case 'h':
                this._time._minute = 0;
            case 'm':
                this._time._second = 0;
        }

        if (unit === 'w')
            this.add(-this._date.dayOfWeek(this._date), 'd');

        return this;
    }

    function endOf(unit) {
        switch (unit) {
            case 'y':
                this._date.month(this._date.calendar().monthsInYear(this.year()));
            case 'M':
                this._date.day(this._date.calendar().daysInMonth(this._date));
            case 'w':
            case 'd':
                this._time._hour = 23
            case 'h':
                this._time._minute = 59;
            case 'm':
                this._time._second = 59;
        }

        if (unit === 'w')
            this.add(this._date.calendar().daysInWeek() - this._date.calendar().dayOfWeek(this._date), 'd');

        return this;
    }

    function isAfter(datetime, unit) {
        unit = (unit === undefined) ? 'd' : unit;
        return this.compareTo(datetime, unit) === 1 ? true : false;
    }

    function isBefore(datetime, unit) {
        unit = (unit === undefined) ? 'd' : unit;
        return this.compareTo(datetime, unit) === -1 ? true : false;
    }

    function isSame(datetime, unit) {
        if (datetime === null) return false;
        return this.compareTo(datetime, unit) === 0 ? true : false;
    }

    function compareTo(datetime, unit) {
        return this._date.year() > datetime._date.year() ? 1 :
            this._date.year() < datetime._date.year() ? -1 :
            unit === 'y' ? 0 :
            this._date.month() > datetime._date.month() ? 1 :
            this._date.month() < datetime._date.month() ? -1 :
            unit === 'M' ? 0 :
            this._date.day() > datetime._date.day() ? 1 :
            this._date.day() < datetime._date.day() ? -1 :
            unit === 'd' ? 0 :
            this._time._hour > datetime._time._hour ? 1 :
            this._time._hour < datetime._time._hour ? -1 :
            unit === 'h' ? 0 :
            this._time._minute > datetime._time._minute ? 1 :
            this._time._minute < datetime._time._minute ? -1 :
            unit === 's' ? 0 :
            this._time._second > datetime._time._second ? 1 :
            this._time._second < datetime._time._second ? -1 : 0;
    }

    function isBetween(from, to, unit) {
        return this.isAfter(from, unit) && this.isBefore(to, unit);
    }

    function isValid(datetime, granularity) {
        return true;
    }

    function isMoment(obj) {
        return obj instanceof CDateTime || (obj != null && obj._isCDateTime === true);
    }

    function format(format) {
        format = this._map_specifiers(format);
        return this._format(format);
    }

    function strptime(str, format) {
        format = this._map_specifiers(format);
        return this._strptime(str, format);
    }

    function _format(format) {
        var result = '',
            specifier = false,
            c = null;

        for (var i = 0; i < format.length; i++) {
            c = format.charAt(i);

            if (c === '%') {
                specifier = true;
                continue;
            }

            if (specifier === false) {
                result += format[i];
                continue;
            }
            specifier = false;
            if (c === 'W') {
                result += this._date.calendar().local.dayNames[this._date.day() - 1];
            } else if (c === 'w') {
                result += this._date.calendar().local.dayNamesMin[this._date.dayOfWeek()];
            } else if (c === 'B') {
                result += this._date.calendar().local.monthNames[this._date.month() - 1];
            } else if (c === 'b') {
                result += this._date.calendar().local.monthNamesShort[this._date.month() - 1];
            } else if (c === 'd') {
                result += this._date.day() < 10 ? '0' + this._date.day() : this._date.day();
            } else if (c === 'H') {
                result += this._time._hour < 10 ? '0' + this._time._hour : this._time._hour;
            } else if (c === 'h') {
                var h = this._time._hour % 12 || 12;
                result += h < 10 ? '0' + h : h;
            } else if (c === 'M') {
                result += this._time._minute < 10 ? '0' + this._time._minute : this._time._minute;
            } else if (c === 'm') {
                result += this._date.month() < 10 ? '0' + this._date.month() : this._date.month();
            } else if (c === 'a') {
                result += this._time._hour > 11 ? 'PM' : 'AM';
            } else if (c === 'S') {
                result += this._time._second < 10 ? '0' + this._time._second : this._time._second;
            } else if (c === 'Y') {
                result += this._date.year();
            } else {
                result += format[i];
            }
        }

        return result;
    }

    function _strptime(str, format) {
        var specifier = false,
            c = null,
            str_pos = 0,
            index = 0;

        for (var i = 0; i < format.length; i++) {
            c = format.charAt(i);

            if (c === '%') {
                specifier = true;
                continue;
            }

            if (specifier === false) {
                str_pos++;
                continue;
            }
            specifier = false;

            if (c === 'W') {
                index = this._indexOfSubStr(str, this._date.calendar().local.dayNames);
                this._date.day(index + 1);
                str_pos += this._date.calendar().local.dayNames[index].length;
            } else if (c === 'w') {
                index = this._indexOfSubStr(str, this.date().calendar().local.dayNamesMin);
                this.date().day(index + 1);
                str_pos += this.date().calendar().local.dayNamesMin[index].length;
            } else if (c === 'B') {
                index = this._indexOfSubStr(str, this.date().calendar().local.monthNames);
                this.date().month(index + 1);
                str_pos += this.date().calendar().local.monthNames[index].length;
            } else if (c === 'b') {
                index = this._indexOfSubStr(str, this.date().calendar().local.monthNamesShort);
                this.date().month(index + 1);
                str_pos += this.date().calendar().local.monthNamesShort[index].length;
            } else if (c === 'd') {
                this.date().day(parseInt(str.substr(str_pos, 2)));
                str_pos += 2;
            } else if (c === 'H') {
                this._time._hour = parseInt(str.substr(str_pos, 2));
                str_pos += 2;
            } else if (c === 'h') {
                this._time._hour = parseInt(str.substr(str_pos, 2));
                str_pos += 2;
            } else if (c === 'M') {
                this._time._minute = parseInt(str.substr(str_pos, 2));
                str_pos += 2;
            } else if (c === 'm') {
                this.date().month(parseInt(str.substr(str_pos, 2)));
                str_pos += 2;
            } else if (c === 'a') {
                index = this._indexOfSubStr(str.substr(str_pos), ['AM', 'PM']);
                if (index === 1) this._time.add(12, 'h');
                str_pos += 2;
            } else if (c === 'S') {
                this._time._second = parseInt(str.substr(str_pos, 2));
                str_pos += 2;
            } else if (c === 'Y') {
                this.date().year(parseInt(str.substr(str_pos, 4)));
                str_pos += 4;
            } else {
                str_pos++;
            }
        }

        return this;
    }

    function _map_specifiers(format) {
        var i, map = [
            ['dddd', '%W'],
            ['ddd', '%w'],
            ['dd', '%w'],
            ['MMMM', '%B'],
            ['MMM', '%b'],
            ['DD', '%d'],
            ['HH', '%H'],
            ['hh', '%h'],
            ['mm', '%M'],
            ['MM', '%m'],
            ['A', '%a'],
            ['SS', '%S'],
            ['ss', '%S'],
            ['X', '%s'],
            ['YYYY', '%Y'],
            ['LT', '%h:%M %a'],
            ['L', '%m/%d/%Y']
        ];
        for (var i = 0; i < map.length; i++) {
            format = format.replace(map[i][0], map[i][1]);
        }

        return format;
    }

    function _indexOfSubStr(str, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (~str.indexOf(list[i])) return i;
        }
        return -1;
    }

    $.calendars.cdate.prototype.toString = function() {
        return this.day();
    }

    function isObject(input) {
    /* src : moment.js  */
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
  }
    function CDateTime_Constructor(strDateTime, format, strict) {
         // Patch: check if we given only one argument of type object, returning CDateTime with proper date set.
         if ((arguments.length == 1) && isObject(strDateTime)) {
            return new CDateTime(strDateTime._date, strDateTime._time);
        }
        
        return arguments.length >= 2 ?
            (new CDateTime()).strptime(strDateTime, (typeof format !== 'string') ? format[0] : format) :
            new CDateTime();
    }

    function hook() {
        return CDateTime_Constructor.apply(null, arguments);
    }

    var CDateTimeProto = CDateTime.prototype;
    hook.localeData = CDateTimeProto.localeData = localeData;
    hook.longDateFormat = CDateTimeProto.longDateFormat = longDateFormat;
    hook.clone = CDateTimeProto.clone = clone;
    hook.locale = CDateTimeProto.locale = locale;
    hook.date = CDateTimeProto.date = date;
    hook.second = CDateTimeProto.second = second;
    hook.minute = CDateTimeProto.minute = minute;
    hook.hour = CDateTimeProto.hour = hour;
    hook.day = CDateTimeProto.day = day;
    hook.month = CDateTimeProto.month = month;
    hook.weekday = CDateTimeProto.weekday = weekday;
    hook.year = CDateTimeProto.year = year;
    hook.add = CDateTimeProto.add = add;
    hook.subtract = CDateTimeProto.subtract = subtract;
    hook.startOf = CDateTimeProto.startOf = startOf;
    hook.endOf = CDateTimeProto.endOf = endOf;
    hook.isAfter = CDateTimeProto.isAfter = isAfter;
    hook.isBefore = CDateTimeProto.isBefore = isBefore;
    hook.isSame = CDateTimeProto.isSame = isSame;
    hook.compareTo = CDateTimeProto.compareTo = compareTo;
    hook.isBetween = CDateTimeProto.isBetween = isBetween;
    hook.isValid = CDateTimeProto.isValid = isValid;
    hook.isMoment = CDateTimeProto.isMoment = isMoment;
    hook.format = CDateTimeProto.format = format;
    hook.strptime = CDateTimeProto.strptime = strptime;
    CDateTimeProto._format = _format;
    CDateTimeProto._strptime = _strptime;
    CDateTimeProto._map_specifiers = _map_specifiers;
    CDateTimeProto._indexOfSubStr = _indexOfSubStr;
    CDateTimeProto.hours = CDateTimeProto.hour;
    CDateTimeProto.minutes = CDateTimeProto.minute;
    CDateTimeProto.seconds = CDateTimeProto.second;

    return hook;
}));
