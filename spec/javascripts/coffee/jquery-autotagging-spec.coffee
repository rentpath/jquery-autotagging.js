describe 'jqueryAutotagging', ->

  module = null

  beforeEach (done) ->
    require ["jquery-autotagging"], (mod) ->
      module = new mod()
      done()

  afterEach ->
    module = null

  it 'exists', ->
    expect(module).toBeTruthy()
