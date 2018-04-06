var minixhr = require('minixhr')

module.exports = getGithubData

function getGithubData (callback) {

  minixhr(url, response)

  function response (json) {
    var userprofiles = localStorage['userprofiles']
    if (userprofiles) {
      return callback(JSON.parse(userprofiles))
    }

    var allusers = JSON.parse(json)
    // console.info(allusers)
    var userprofiles = []

    allusers.forEach(function (nameEach) {
      var reponame = nameEach.full_name
      var repoURL = 'https://api.github.com/repos/' + reponame
      minixhr(repoURL, response2)
     })
    function response2 (data) {
      var obj = JSON.parse(data)
      var repoFilesAndFoldersURL = obj.branches_url.replace('{/branch}', '/' + obj.default_branch)

      minixhr(repoFilesAndFoldersURL, function (data) {
        var obj = JSON.parse(data)
        var filesAndFoldersURL = obj.commit.commit.tree.url

        minixhr(filesAndFoldersURL, function (data) {
          var obj = JSON.parse(data)
          obj.tree.forEach(function (file) {
            if (file.path === 'config.json') {
              var configJsonURL = file.url
              minixhr(configJsonURL, function (data) {
                try {
                  var obj = JSON.parse(data)
                  var json = atob(obj.content)
                  var profile = JSON.parse(json)
                } catch (error) {
                  profile = { name: 'error', url: configJsonURL }
                }

                userprofiles.push(profile)
                if (allusers.length == userprofiles.length) {
                  localStorage['userprofiles'] = JSON.stringify(userprofiles)
                  callback(userprofiles)
                }

              })
            }
          })
        })
      })
    }
  }
}
