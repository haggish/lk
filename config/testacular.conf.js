basePath = '../';

files = [
    JASMINE,
    JASMINE_ADAPTER,
    'app/lib/angular/angular.js',
    'app/lib/angular/angular-*.js',
    'test/lib/angular/angular-mocks.js',
    'test/lib/jquery/jquery-latest.js',
    'app/js/**/*.js',
    'test/unit/testdata.js',
    'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
    outputFile:'test_out/unit.xml',
    suite:'unit'
};
