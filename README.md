
### Bootstrap Calendars

If you are looking for a non-Gregorian calendar for bootstrap and you like [bootstrap-datetimepicker](https://github.com/Eonasdan/bootstrap-datetimepicker) then you are in the right place. This script provides an interface to link bootstrap-datetimepicker with [jQuery Calendars](https://github.com/kbwood/calendars).

### Usage
1. Include jQuery, jQuery Calendars, any specific calendar, this interface, then bootstrap-datetimepicker.
2. Attach datetimepicker to an input. Relevent instructions available on bootstrap-datetimepicker page.
3. Specific calendars must be indicated by passing a parameter, as the following: 

`
  $('#datetimepicker').datetimepicker(
    {locale: {calender: 'ummalqura', lang: 'ar'} 
  }); 
`  

  The name of the calendar, "ummalqura" in this example, should match the definition of the calendar. Refer to [this page](http://keith-wood.name/calendars.html) for additional information regarding the supported calendars and their names. The lang parameter, "ar" in this example, is optional.

### Demo

A demo file is included inside demo directory.
