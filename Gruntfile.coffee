module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        typescript:
            build:
                src: [
                    'src/**/*.ts'
                ]
                dest: 'build/app.js'
            test:
                src: [
                    'test/**/*.ts'
                ]
                dest: 'compiled'
        handlebars:
            options:
                namespace: "HBS"
            compile:
                files:
                    "build/tpl/all.js": "src/tpl/**/*.hbs"
        concat:
            dist:
                src: [
                    'bower_components/jquery/jquery.js'
                    'bower_components/handlebars/handlebars.js'
                    'bower_components/showv/build/showv.js'
                    'build/tpl/all.js'
                    'build/app.js'
                ]
                dest: 'build/app.js'
        # 最後にどうこうする
        uglify:
            build:
                files:
                    'build/app.min.js': ['build/app.js']
        exec:
            release:
                cmd: 'sh scripts/release.sh'
        clean:
            all:
                src: ['compiled/**/*.js', 'compiled/*', 'build/**/*.js']

    grunt.loadNpmTasks 'grunt-typescript'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-handlebars'
    grunt.loadNpmTasks 'grunt-exec'

    grunt.registerTask 'build', 'build/app.jsをビルドします',['typescript:build', 'handlebars', 'concat:dist']
    grunt.registerTask 'test', 'テスト用ビルドします',['build','typescript:test']
    grunt.registerTask 'release', 'リリースビルドつくる', ['build','uglify:build','exec:release']

    grunt.registerTask 'default', ['build']
