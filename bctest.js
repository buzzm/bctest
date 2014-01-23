/**
 *  BCTest.js
 *  A deliberately low-drama framework to run a set of timed tests.
 *  Assumes loading into a mongoDB shell via load(bctest.js:) because
 *  it will call several methods on the db object.
 *
 *  - Buzz Moschetti, 21-Jan-2014
 */
var BCTest = (function() {
	var my = {};

	my.performTests = function(tests) {

	    soloTests = []
	    for (var i = 0; i < tests.length; i++) {
		if(tests[i]['solo'] == true) {
		    soloTests.push(tests[i]);
		}
	    }

	    if(soloTests.length > 0) {
		testsToRun = soloTests;
	    } else {
		testsToRun = tests;
	    }

	    colls = {};
	    colla = [];
	    mutes = 0;
	    for (var i = 0; i < testsToRun.length; i++) {
		t = testsToRun[i];
		if(t['collection']) {
		    cn = t['collection'];
		    if(colls[cn] != null) {
			a = colls[cn];
			a = a + 1;
			colls[cn] = a;
		    } else {
			colls[cn] = 0;
			colla.push(cn);
		    }

		}
		if(t['mute']) {
		    mutes++;
		}
	    }
	    
	    
	    v  = db.serverBuildInfo().version;  // version
	    si = db.serverBuildInfo().sysInfo; 
	    rd = new Date();  // run date
	    
	    print("Rundate:     " + rd);
	    print("ServerVers:  " + v);
	    print("ServerInfo:  " + si);
	    
	    for (var i = 0; i < colla.length; i++) {
		if(i == 0) {
		    print("\nCollection       Count");
		}
		// need a good sprintf() thing here....
		cn = colla[i];
		print(cn + "        " + db[cn].count());
	    }
	    print("");
	    
	    print(tests.length + " available tests; " + soloTests.length + " soloed; " + mutes + " muted\n");
	    
	    print("Test  Run Time  Indexes");
	    print("===== ========  =========================================");
	    
	    
	    for (var qzq = 0; qzq < testsToRun.length; qzq++) {
		t = testsToRun[qzq];
		
		if(t['mute'] == true) {
		    continue;
		}
		
		if(t['f']) {
		    idx = [];
		    idxs = "none";

		    if(t['collection']) {
			cn = t['collection'];
			db[cn].getIndexes().forEach(function(a){if(a.name != "_id_"){idx.push(a.name)}});
			idxs = idx.join();
		    }

		    funcstr = String(t['f']); // stringify the function itself!  neat!
		    funcstr = funcstr.replace(/^[ \t]+/g, "");
		    
		    var before = ISODate();
		    var r = t['f']();
		    var total = ISODate() - before;
		    
		    print("#" + (qzq+1) + "    " + total + "ms         " + idxs);
		    print(funcstr);

		    if(t['show']) {
			print(JSON.stringify(r,null,'\t'));
		    }
		    print("------------------------------------");
		}
	    }
	}

	return my;
}());
