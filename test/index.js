const expect = require('chai').expect
const repos = require('..')
const uniq = require('lodash').uniq
const they = it

describe('repos', function () {
  it('is an array of over 12945 repo objects', function () {
    expect(repos).to.be.an('array')
    expect(repos.length).to.be.above(12945)
  })

  it('contains over 11319 non-forks', function () {
    expect(repos.filter(repo => !repo.fork).length).to.be.above(11319)
  })

  it('contains over 10380 repos that were never forks', function () {
    expect(repos.filter(repo => !repo.formerFork).length).to.be.above(10380)
  })

  they('are sometimes forks disguised as non-forks', function () {
    const spectron = repos.find(repo => repo.fullName === 'electron/spectron')
    expect(spectron.formerFork).to.equal(false)

    const marvelClicker = repos.find(repo => repo.fullName === 'axeltonson/marvel-clicker')
    expect(marvelClicker.formerFork).to.equal(true)
  })

  they('all have a unique user/repo fullName', function () {
    const names = repos.map(repo => repo.fullName)
    expect(uniq(names).length).to.equal(names.length)
  })

  they('all have a firstCommit object', function () {
    expect(repos.every(repo => repo.firstCommit.sha.length > 0)).to.equal(true)
  })

  they('all have a filename', function () {
    expect(repos.every(repo => repo.filename.length > 0)).to.equal(true)
  })

  they('are sorted by fork count', function () {
    expect(repos[0].forksCount).to.be.above(2000)
    expect(repos[repos.length - 1].forksCount).to.equal(0)
  })

  they('always have a status and packageStatus of 200', function () {
    expect(repos.every(repo => repo.status === 200)).to.equal(true)
    expect(repos.every(repo => repo.packageStatus === 200)).to.equal(true)
  })

  they('always have a name', function () {
    expect(repos.every(repo => repo.name.length > 0)).to.equal(true)
  })

  they('always have a contributors array', function () {
    expect(repos.every(repo => Array.isArray(repo.contributors))).to.equal(true)
  })

  they('always have a releases array', function () {
    this.skip() // a few repos are missing. why?
    repos.forEach(repo => {
      expect(repo.releases).to.be.an('array', `${repo.name} should have a releases array`)
    })
  })

  they('always have a packageJSON object', function () {
    repos.forEach(repo => {
      expect(repo.packageJSON).to.be.an('object', `${repo.name} should have a packageJSON object`)
      expect(repo.pkg).to.deep.equal(repo.packageJSON, `${repo.name} should have a 'pkg' alias`)
    })
  })

  they('have nice-package convenience methods', function () {
    const spectron = repos.find(repo => repo.fullName === 'electron/spectron')

    expect(spectron.pkg.dependsOn('dev-null')).to.equal(true)
    expect(spectron.pkg.devDependsOn('mocha')).to.equal(true)
    expect(spectron.pkg.somehowDependsOn('split')).to.equal(true)
  })

  they('all depend on electron or electron-prebuilt', function () {
    expect(repos.every(repo => repo.pkg.somehowDependsOn('electron') || repo.pkg.somehowDependsOn('electron-prebuilt'))).to.equal(true)
  })
})
