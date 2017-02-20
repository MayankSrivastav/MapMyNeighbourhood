module.exports = function(grunt) {
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      uglify: {
        build: {
          src: 'css/style.css',
          dest: 'dest/css/style.css'
        }
      },
      critical: {
        dist: {
          options: {
            base: './'
          },
          src: 'index.html',
          dest: 'dest/index.html'
        }
      }
  });

  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-critical');

  // grunt.registerTask('default', ['uglify', 'critical']);
};
