var complete = false;
var lines = [];
var years = ['1500', '1810', '1900', '2000'];
var classArr = [];
var fallenArr = [];

$.ajax({
    type: "GET",
    url: "meteorsWithImage.csv",
    dataType: "text",
    success: function(data) { processData(data); }
});

var queryParams = parseURI(window.location.search);
var year = (queryParams["year"] == null || queryParams["year"] < 0 || queryParams["year"] > 4) ? 4 : parseInt(queryParams["year"]);
var cat = (queryParams["cat"] == null || queryParams["cat"] < 0 || queryParams["cat"] == 'all') ? 'all' : parseInt(queryParams["cat"]);
var found = (queryParams["found"] == null || queryParams["found"] < 0 || queryParams["found"] == 'all') ? 'all' : parseInt(queryParams["found"]);
var id = (queryParams["id"] == null || queryParams["id"] < 0 || queryParams["id"] == 'all') ? 'all' : parseInt(queryParams["id"]);

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');

    for (j in years) {
        var dataArr = [];
        var year = { "year": years[j], "data": dataArr };
        lines.push(year);
    }

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            if (data[5] == null || data[5] == "")
                continue;
            if (data[7] == null || data[7] == "")
                continue;
            if (data[8] == null || data[8] == "")
                continue;
            if (parseInt(data[7]) == 0 && parseInt(data[8]) == 0)
                continue;
            var recYear = parseInt(getYearRange(data[5]));
            var year = -1;
            console.log();
            for (j in lines) {
                if (lines[j].year == recYear) {
                    var catVal = -1;
                    var fallen = -1;
                    for (k in classArr) {
                        if (classArr[k].name == data[2]) {
                            catVal = classArr[k].id;
                            classArr[k].count++;
                            break;
                        }
                    }
                    if (catVal == -1) {
                        var category = { "name": data[2], "id": classArr.length, "count": 1 };
                        catVal = classArr.length;
                        classArr.push(category);
                    }
                    for (k1 in fallenArr) {
                        if (fallenArr[k1].name == data[4]) {
                            fallen = fallenArr[k1].id;
                            fallenArr[k1].count++;
                            break;
                        }
                    }
                    if (fallen == -1) {
                        var fallenCat = { "name": data[4], "id": fallenArr.length, "count": 1 };
                        fallen = fallenArr.length;
                        fallenArr.push(fallenCat);
                    }
                    var rowObj = { "id": data[6], "name": data[0], "mass": data[3], "classVal": catVal, "fall": fallen, "year": data[5], "lat": data[7], "lon": data[8], "image": data[9] }
                    var dataArr = lines[j].data;
                    dataArr.push(rowObj);
                }
            }
        }
    }

    complete = true;
}