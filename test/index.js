const expect = require('chai').expect
const repos = require('..')
const they = it

describe('repos', function () {
  it('is an array with hella repos', function () {
    expect(repos).to.be.an('array')
    expect(repos.length).to.be.above(4400)
  })

  they('always have a name', function () {
    expect(repos.every(repo => repo.name.length > 0)).to.equal(true)
  })

  they('always have a packageJSON object', function () {
    repos.forEach(repo => {
      expect(repo.packageJSON).to.be.an('object', `${repo.name} should have a packageJSON object`)
      expect(repo.pkg).to.deep.equal(repo.packageJSON, `${repo.name} should have a 'pkg' alias`)
    })
  })

  they('have some aliases for nice-package convenience methods', function () {
    const spectron = repos.find(repo => repo.fullName === 'electron/spectron')

    expect(spectron.pkg.dependsOn('dev-null')).to.equal(true)
    expect(spectron.pkg.devDependsOn('dev-null')).to.equal(true)
  })
})