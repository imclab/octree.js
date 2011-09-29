/*global text,expect,ok,module,notEqual,Paladin,test,window,start,stop,console,asyncTest*/
(function () {

  function drawTree( tree ) {
    var canvas = document.getElementById( "test-canvas" ),
        ctx = canvas.getContext( "2d" ),
        width = canvas.width,
        height = canvas.height,
        size = tree.size;

    ctx.fillStyle = "#000";
    ctx.fillRect( 0, 0, width, height );
    ctx.save();
    ctx.translate( width / 2, height / 2 );
    ctx.scale( width/size, height/size );

    function draw( tree ) {
      var pos = tree.position,
          size = tree.size,
          hSize = size / 2;

      var children = tree.children;
      for ( var i=0, l=children.length; i<l; ++i ) {
        if ( children[ i ] ) {
          draw( children[ i ] );
        } //if
      } //for

      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.rect( pos[ 0 ] - hSize, pos[ 2 ] - hSize, size, size ); 
      if ( tree.nodes.length > 0 ) {
        ctx.fillStyle = "rgba( 255, 0, 0, 0.5 )";
        ctx.fill();
      } //if
      ctx.stroke();
    } //draw

    draw( tree );
    ctx.restore();

  } //drawTree

  module( "core", {
    setup: function () {
    },
    teardown: function () {
    }
  });

  test( "Octree Creation", function() {
    expect( 1 );
    var octree = new Octree({ size: 1, depth: 1 });
    ok( octree, "Octree exists" );
  });

  test( "OctreeNode Creation", function() {
    expect( 1 );
    var node = new Octree.Node();
    ok( node, "OctreeNode exists" );
  });

  test( "Inside boundaries", function() {
    expect( 1 );

    var testObj = {
      foo: 'bar'
    };

    var inserted = false;

    var octree = new Octree({
      size: 1000,
      depth: 4
    });

    var node = new Octree.Node({
      object: testObj,
      aabb: [
        [ 5, 5, 5 ],
        [ 10, 10, 10 ]
      ],
      inserted: function( subtree ) {
        inserted = subtree.position;
      }
    });

    octree.insert( node );

    ok( inserted[ 0 ] === inserted[ 1 ] && 
        inserted[ 1 ] === inserted[ 2 ] &&
        inserted[ 2 ] === 31.25, "Node inserted correctly" );

    drawTree( octree.root );

  });

  test( "Across boundaries", function(a) {
    expect( 1 );

    var testObj = {
      foo: 'bar'
    };

    var inserted = [];

    var octree = new Octree({
      size: 1000,
      depth: 4
    });

    var node = new Octree.Node({
      object: testObj,
      aabb: [
        [ -82.5, -62.5, -62.5 ],
        [ -42.5, -42.5, -42.5 ]
      ],
      inserted: function( subtree ) {
        console.log( subtree.position );
        inserted.push( subtree.position );
      }
    });

    octree.insert( node );

    ok( inserted.length === 2 &&
        inserted[ 0 ][ 0 ] === -93.75 && 
        inserted[ 0 ][ 1 ] === -31.25 &&
        inserted[ 0 ][ 2 ] === -31.25 &&
        inserted[ 1 ][ 0 ] === -31.25 &&
        inserted[ 1 ][ 1 ] === -31.25 &&
        inserted[ 1 ][ 2 ] === -31.25,
         "Node inserted correctly" );

    drawTree( octree.root );

  });


})();
