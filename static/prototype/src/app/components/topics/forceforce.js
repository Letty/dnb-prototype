import * as d3 from 'd3'

function rectCollide () {
  var nodes, sizes, masses
  var size = constant([0, 0])
  var strength = 1
  var iterations = 1

  function force () {
    var node, size, mass, xi, yi
    var i = -1
    while (++i < iterations) { iterate() }

    function iterate () {
      var j = -1
      var tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)

      while (++j < nodes.length) {
        node = nodes[j]
        size = sizes[j]
        mass = masses[j]
        xi = xCenter(node)
        yi = yCenter(node)

        tree.visit(apply)
      }
    }

    function apply (quad, x0, y0, x1, y1) {
      var data = quad.data
      var xSize = (size[0] + quad.size[0]) / 2
      var ySize = (size[1] + quad.size[1]) / 2
      if (data) {
        if (data.index <= node.index) { return }

        var x = xi - xCenter(data)
        var y = yi - yCenter(data)
        var xd = Math.abs(x) - xSize
        var yd = Math.abs(y) - ySize

        if (xd < 0 && yd < 0) {
          var l = Math.sqrt(x * x + y * y)
          var m = masses[data.index] / (mass + masses[data.index])

          if (Math.abs(xd) < Math.abs(yd)) {
            node.vx -= (x *= xd / l * strength) * m
            data.vx += x * (1 - m)
          } else {
            node.vy -= (y *= yd / l * strength) * m
            data.vy += y * (1 - m)
          }
        }

        // if (data.x === node.x) {
        //   data.vx *= 2
        //   node.vx *= -2
        // }
      }

      return x0 > xi + xSize || y0 > yi + ySize ||
               x1 < xi - xSize || y1 < yi - ySize
    }

    function prepare (quad) {
      if (quad.data) {
        quad.size = sizes[quad.data.index]
      } else {
        quad.size = [0, 0]
        var i = -1
        while (++i < 4) {
          if (quad[i] && quad[i].size) {
            quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
            quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
          }
        }
      }
    }
  }

  function xCenter (d) { return d.x + d.vx * 10 }
  function yCenter (d) { return d.y + d.vy }

  force.initialize = function (_) {
    sizes = (nodes = _).map(size)
    masses = sizes.map(function (d) { return d[0] * d[1] })
  }

  force.size = function (_) {
    if (_ != null) size = typeof _ === 'function' ? _ : constant(_)
    return force
    // return (arguments.length
    //   ? (size = typeof _ === 'function' ? _ : constant(_), force)
    //   : size)
  }

  force.strength = function (_) {
    if (_ != null) strength = +_
    return force
    // return (arguments.length ? (strength = +_, force) : strength)
  }

  force.iterations = function (_) {
    if (_ != null) iterations = +_
    return force
  }

  return force
}

function constant (_) {
  return function () { return _ }
}

export default rectCollide
