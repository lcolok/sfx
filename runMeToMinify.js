var UglifyJS = require("uglify-js");
var fs = require("fs");

/* var code = {
    "file1.js": "function add(first, second) { return first + second; }",
    "file2.js": "console.log(add(1 + 2, 3 + 4));"
}; */
var inputPath = "sfx.js";
var ouputPath = inputPath.replace('.js', '.min.js');

var code = fs.readFileSync(inputPath, "utf8");

var options = { toplevel: true };

var result = UglifyJS.minify(code, options);


if (!result.error) {
    console.log("Uglify成功");
    // console.log(result.code);
    fs.writeFileSync(ouputPath, result.code, "utf8");
} else {
    console.log("Uglify失败");
    console.log(result.error);
}