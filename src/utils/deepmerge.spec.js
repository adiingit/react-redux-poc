import deepmerge from './deepmerge'
import deepFreeze from 'deep-freeze-strict'

/** @test {(Utility -> Function) deepmerge} */
describe('(Utility -> Function) deepmerge', function () {
  it('Should merge correctly when the next object has a different array of items', function () {
    const original = deepFreeze({
      one: {
        array: ['a', 'b', 'c'],
        two: {
          array: ['d', 'e', 'f'],
          three: {
            array: [1, 2, 3]
          }
        }
      }
    })

    // Test keeping number of items the same but array has different values
    const nextOneArray = ['a', 'e', 'c']

    // Test removing one item from the array
    const nextTwoArray = ['d', 'f']

    // Test adding more items to the array
    const nextThreeArray = [1, 2, 3, 4, { foo: 'bar' }, () => {}]

    const next = deepFreeze({
      one: {
        array: nextOneArray,
        two: {
          array: nextTwoArray,
          three: {
            array: nextThreeArray
          }
        }
      }
    })

    const newObject = deepmerge(original, next)

    expect(newObject.one.array).to.deep.equal(nextOneArray)

    expect(newObject.one.two.array).to.deep.equal(nextTwoArray)

    expect(newObject.one.two.three.array).to.deep.equal(nextThreeArray)
  })

  it('Should remove property if the next object set it\'s value to undefined', function () {
    const original = deepFreeze({
      one: {
        two: {
          three: { foo: 'bar' }
        }
      }
    })

    const next = deepFreeze({
      one: {
        two: {
          three: undefined
        }
      }
    })

    const newObject = deepmerge(original, next)

    expect(newObject.one.two).to.not.have.property('three')
  })
})
