import { getBoundingBoxDimensions } from './shape'

/** @test {(Utility -> Method) Shape -> getBoundingBoxDimensions} */
describe('(Utility -> Method) Shape -> getBoundingBoxDimensions', () => {
  it('Should calculate 45 degrees correctly.', () => {
    const dimensions = getBoundingBoxDimensions(1, 1, 45)

    // Floating point comparison fails due to varying precision
    expect(Math.ceil(dimensions.crossAxis * 10000000)).to.equal(Math.ceil(Math.SQRT2 * 10000000))
    expect(Math.ceil(dimensions.mainAxis * 10000000)).to.equal(Math.ceil(Math.SQRT2 * 10000000))
  })

  it('Should calculate -45 degrees correctly.', () => {
    const dimensions = getBoundingBoxDimensions(1, 1, -45)

    // Floating point comparison fails due to varying precision
    expect(Math.ceil(dimensions.crossAxis * 10000000)).to.equal(Math.ceil(Math.SQRT2 * 10000000))
    expect(Math.ceil(dimensions.mainAxis * 10000000)).to.equal(Math.ceil(Math.SQRT2 * 10000000))
  })

  it('Should calculate 0 degrees correctly.', () => {
    const dimensions = getBoundingBoxDimensions(1, 1, 0)

    // Floating point comparison fails due to varying precision
    expect(dimensions.crossAxis).to.equal(1)
    expect(dimensions.mainAxis).to.equal(1)
  })

  it('Should calculate 0 length correctly.', () => {
    const dimensions = getBoundingBoxDimensions(0, 0, 0)

    expect(dimensions.crossAxis).to.equal(0)
    expect(dimensions.mainAxis).to.equal(0)
  })
})
