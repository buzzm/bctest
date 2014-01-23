bctest
======

A simple, small javascript framework to execute timed tests 
from within a mongoDB shell.

Basic use:

```
> use mydb;  // important to set your db ref
> load("bctest.js");
true
> BCTest.performTests([ { f: function() { db.getCollectionNames(); } } ])
Rundate:     Tue Jan 21 2014 11:06:40 GMT-0500 (EST)
ServerVers:  2.5.5-pre-
ServerInfo:  Darwin mci-osx108-2.build.10gen.cc 12.3.0 Darwin Kernel Version 12.3.0: Sun Jan  6 22:37:10 PST 2013; root:xnu-2050.22.13~1/RELEASE_X86_64 x86_64 BOOST_LIB_VERSION=1_49

1 available tests; 0 soloed; 0 muted

Test  Run Time  Indexes
===== ========  =========================================
#1    1ms         none
function () { db.getCollectionNames(); }
------------------------------------
>
```

In general, you'll want to set up your set of tests in a separate 
file and call BCTest.performTest() at the end of the script.  
load() the file to run the tests, tweak, save, reload, etc.

```
$ cat bct1.js
tests = [
     {
       collection: "researchfacetsflat",
       f: function() {
             r = db.researchfacetsflat.aggregate([ {$group: {_id: ''} } ]);
             return r;
       }
     }
     ,{
       collection: "researchfacetsflat",
       f: function() {
             r = db.researchfacetsflat.aggregate([ {$group: {_id: {} } } ]);
             return r;
       }
     }
];
BCTest.performTests(tests);
```

A few simple per-item options:
```
{
     collection: ”name",  // if present, will be used to emit counts and indexes
     mute:true, // if true, skip this test
     solo:true, // If true, run only this test (and other soloed tests too)
     show:true, // if true, emit the returned variable from the test function
     //…
}
```
