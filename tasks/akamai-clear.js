/*
 * grunt-akamai-clear
 * https://github.com/patrickkettner/grunt-akamai-clear
 *
 * Copyright (c) 2012 Patrick Kettner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var akamai = require('akamai');

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('akamai', 'Purge/Invalidate Akamai', function() {
    var done = this.async();
    var data = this.data;
    var matchers  = (data.fileMatch)? data.fileMatch : null ;

    var urls = data.urls || getFoldersFileNames(matchers);

    grunt.log.verbose.ok(urls);
    var thisPurge = new akamai.purge(
      urls, {
      user: data.user,
      password: data.password,
      domain: (data.domain || 'production'),
      notify: data.notify
    }, function (err, response) {
      if (err) {
        grunt.log.error(err);
        return;
      }

      done('akamai request sent');
    });
  });

  /**
   * Let it search fs and get the list of files to invalidate
   * @param fileMatch
   * @returns {Array}
   */
  var getFoldersFileNames = function(fileMatch){

    var resultUrls = [];

    if (fileMatch && fileMatch !== null && fileMatch.pattern && fileMatch.dest){
      var options = fileMatch.options;
      options.rename = function(dest, matchedSrcPath, options) {
        return (dest +  matchedSrcPath); //instead of using path which is for real paths in fs
      };

      var map = grunt.file.expandMapping(fileMatch.pattern, fileMatch.dest,fileMatch.options );
      map.forEach(function(url){
        resultUrls.push(url.dest);
      });
    }
    return resultUrls;

  }

};
