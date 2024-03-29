module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      dist: {
        files: ["src/**/*.js"],
        tasks: ['build']
      }
    },
    copy: {
      dist: {
        expand: true,
        cwd: 'src',
        src: ['jquery.appcache.js'],
        dest: 'dist/'
      },
      samples: {
        expand: true,
        cwd: 'dist',
        src: ['jquery.appcache.js'],
        dest: 'samples/dist/'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/jquery.appcache.min.js': ['src/jquery.appcache.js']
        }
      }
    },
    connect: {
      samples: {
        options: {
          open: true,
          base: 'samples',
          port: 9000,
          livereload: true,
          keepalive: false,
          index: 'index.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['jshint']);
  
  grunt.registerTask('build', ['copy:dist', 'uglify:dist', 'copy:samples']);
  
  grunt.registerTask('serve', ['build', 'connect:samples', 'watch']);

};