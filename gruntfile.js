module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      dist: {
        src: ['www/js/app.js', 'www/js/controllers.js', 'www/js/directives.js', 'www/js/services.js'],
        dest: 'dist/application.js',
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/application.js',
        dest: 'build/application.min.js'
      }
    },
    
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'www/css',
          src: ['*.css', '!*.min.css'],
          dest: 'www/css',
          ext: '.min.css'
        }]
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['concat']);

};