var int = self.setInterval(function() {
    if (complete) {
        window.clearInterval(int);
        renderGlobe();
    }
}, 1000);

var globe;
var container;

var setClass = function(classid) {
    return function() {
        window.location = "?year=" + year + "&cat=" + classid;
    }
}
var setFall = function(fallid) {
    return function() {
        window.location = "?year=" + year + "&cat=" + cat + "&found=" + fallid;
    }
}

var setYear = function(year) {
    console.log(cat);
    return function() {
        window.location = "?year=" + year + "&cat=" + cat;
    }
}

var setTexture = function(texture) {
    return function() {
        storage.setItem('texture', texture);
        window.location = "?year=" + year + "&cat=" + cat;
    }
}

$('#texture2').click(setTexture('worldvegi'));
$('#texture1').click(setTexture('world'));
var texturediv = (storage.getItem('texture') == 'world') ? document.getElementById('texture1') : document.getElementById('texture2');
texturediv.setAttribute('class', 'btn btn-primary active');
var yactive = document.getElementById('year' + years[year]);
yactive.setAttribute('class', 'btn btn-light');


function renderGlobe() {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    } else {
        container = document.getElementById('container');
        globe = new DAT.Globe(container);


        renderClasses();
        renderFallen();


        for (var i = 0; i < years.length; i++) {
            var y = document.getElementById('year' + years[i]);
            y.addEventListener('click', setYear(i), false);
        }

        // console.log(globe);
        //   console.log(lines[year].data);
        var sortedMeteorArray = lines[year].data.sort(function(a, b) {
            return b.mass - a.mass;
        });
        sortedMeteorArray = $.grep(sortedMeteorArray, function(meteor) {
            if (cat == 'all')
                return meteor;
            else {
                if (meteor.classVal == parseInt(cat))
                    return meteor;
            }
        });
        sortedMeteorArray = $.grep(sortedMeteorArray, function(meteor) {
            if (found == 'all')
                return meteor;
            else {
                if (meteor.fall == parseInt(found))
                    return meteor;
            }
        });
        sortedMeteorArray = $.grep(sortedMeteorArray, function(meteor) {
            if (id == 'all')
                return meteor;
            else {
                if (meteor.id == parseInt(id))
                    return meteor;
            }
        });
        globe.addData(sortedMeteorArray, { format: 'magnitude' });
        //    globe.addData(lines[year].data, {format: 'magnitude'});
        globe.createPoints();
        globe.animate();
        renderInfoDialog(sortedMeteorArray);
        //   console.log(lines);

    }
}

function renderInfoDialog(array) {
    $('#numberMeteor').text(array.length);
    for (i in array) {
        $('<div/>', {
            id: 'prominent' + i,
            class: 'prominent'
        }).appendTo('#specificInfo');
        var length = (array.length > 20) ? 20 : array.length;
        var prev = (i < 1) ? (length - 1) : parseInt(i) - 1;
        var next = (i < length - 1) ? parseInt(i) + 1 : 0;
        $('#prominent' + i).html('<div id="navigator">' + ((array.length > 1) ? '<a href="javascript:navigate(' + prev + ')"><<</a>&nbsp;<a href="javascript:navigate(' + next + ')">>></a>' : '') + '</div>' +
            '<table width="100%" border=0 style="font-size:16px;">' +
            ((array[i].image != '') ? '' : '') +
            '<tr><td class="p-3 mb-2 bg-primary text-white" align="right"><b>Name:</b><td class="p-3 mb-2 bg-primary text-white" align="left">' + array[i].name +
            '<tr><td class="p-3 mb-2 bg-warning text-dark" align="right"><b>Year:</b><td class="p-3 mb-2 bg-warning text-dark" align="left">' + array[i].image + '<tr><td class="p-3 mb-2 bg-success text-white" align="right"><b>Mass:</b><td class="p-3 mb-2 bg-success text-white" align="left">' + array[i].mass +
            '<tr><td align="right"><b>Class:</b><td align="left"><a href="?cat=' + array[i].classVal + '&year=' + $.inArray(getYearRange(array[i].year), years) + '">' + $.grep(classArr, function(n) {
                return (n.id == array[i].classVal);
            })[0].name + '</a>' +
            '<tr><td colspan=2 align="center"><a href="?cat=' + array[i].classVal + '&year=' + $.inArray(getYearRange(array[i].year), years) + '&id=' + array[i].id + '">View on Globe</a>' +
            '<tr><td colspan=2 align="center"><a href="http://www.lpi.usra.edu//meteor/metbull.php?code=' + array[i].id + '" target="_blank">Additional Details</a>' + '</table>');
        if (i > 19)
            break;
    }
    $('.prominent').hide();
    $('#prominent0').show();
}

function showAbout() {
    $('#aboutContainer').show();
}

function navigate(id) {
    $('.prominent').hide();
    $('#prominent' + id).show();
}

function renderClasses() {
    var sortedClassArr = classArr.sort(function(a, b) {
        return b.count - a.count;
    });
    var allY = document.getElementById('sAll');
    allY.addEventListener('click', setClass('all'), false);
    console.log(sortedClassArr.length);
    for (i in sortedClassArr) {
        var rgbArray = generateColor(sortedClassArr[i].id);
        var rgbString = rgbToHex(rgbArray.red, rgbArray.green, rgbArray.blue);

        $('<div/>', {
            id: 'class' + sortedClassArr[i].id,
            class: 'meteorCat',
            rel: 'external',
            style: 'background-color:' + rgbString,
            text: sortedClassArr[i].name + " (" + sortedClassArr[i].count + ")"
        }).appendTo('#meteorInfo');
        var y = document.getElementById('class' + sortedClassArr[i].id);
        y.addEventListener('click', setClass(sortedClassArr[i].id), false);
        if (i > 13)
            break;
    }
    var classactive = (cat == 'all') ? document.getElementById('sAll') : document.getElementById('class' + cat);
    if (classactive != null)
        classactive.setAttribute('class', 'meteorCat active');

}

function renderFallen() {
    var fallenSortedArr = fallenArr.sort(function(a, b) {
        return b.count - a.count;
    });
    for (i in fallenSortedArr) {
        $('<div/>', {
            id: 'fall' + fallenSortedArr[i].id,
            class: 'meteorCat',
            style: 'background-color:#fff',
            rel: 'external',
            text: fallenSortedArr[i].name + " (" + fallenSortedArr[i].count + ")"
        }).appendTo('#fellFoundInfo');
        var y = document.getElementById('fall' + fallenSortedArr[i].id);
        y.addEventListener('click', setFall(fallenSortedArr[i].id), false);
        if (i > 5)
            break;
    }
    if (found == 'all') {
        for (i in fallenSortedArr) {
            var foundactive = document.getElementById('fall' + fallenSortedArr[i].id);
            foundactive.setAttribute('class', 'meteorCat active');
            if (i > 5)
                break;
        }
    } else {
        var foundactive = document.getElementById('fall' + found);
        foundactive.setAttribute('class', 'meteorCat active');
    }


}
