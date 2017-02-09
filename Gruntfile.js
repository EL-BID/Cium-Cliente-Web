module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    ngdocs: {
      options: {
        scripts: ['angular.js'],
		title: 'CLIENTE (App) ',
        html5Mode: true,
		startPage: '/api/App.interface:Scaffolding',    
		image: "../assets/img/icono-cium-blue.png",
    	imageLink: "../#/"
      },
	  api:{
      src: ['src/*.js','src/**/*.js','src/**/**/*.js'],
	  title: 'Documentación'
	  },
    },
    connect: {
      options: {
        keepalive: true
      },
      server: {}
    },
    clean: ['docs']
  });

  grunt.registerTask('default', ['clean', 'ngdocs', 'connect']);

};
