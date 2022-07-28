import { Matrix4Projection } from "../../Source/Cesium.js";
import { Matrix4 } from "../../Source/Cesium.js";
import { Cartesian3 } from "../../Source/Cesium.js";
import { Cartographic } from "../../Source/Cesium.js";
import { Ellipsoid } from "../../Source/Cesium.js";
import { Math as CesiumMath } from "../../Source/Cesium.js";

describe("Core/Matrix4Projection", function () {
  it("construct0", function () {
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
    });
    expect(projection.matrix).toEqual(Matrix4.IDENTITY);
    expect(projection.ellipsoid).toEqual(Ellipsoid.WGS84);
    expect(projection.degrees).toEqual(true);
  });

  it("construct1", function () {
    const ellipsoid = Ellipsoid.UNIT_SPHERE;
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
      ellipsoid: ellipsoid,
    });
    expect(projection.matrix).toEqual(Matrix4.IDENTITY);
    expect(projection.ellipsoid).toEqual(Ellipsoid.UNIT_SPHERE);
    expect(projection.degrees).toEqual(true);
  });

  it("construct2", function () {
    const ellipsoid = Ellipsoid.UNIT_SPHERE;
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
      ellipsoid: ellipsoid,
      degrees: false,
    });
    expect(projection.matrix).toEqual(Matrix4.IDENTITY);
    expect(projection.ellipsoid).toEqual(Ellipsoid.UNIT_SPHERE);
    expect(projection.degrees).toEqual(false);
  });

  it("project0", function () {
    const height = 10.0;
    const cartographic = new Cartographic(0.0, 0.0, height);
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
    });
    expect(projection.project(cartographic)).toEqual(
      new Cartesian3(0.0, 0.0, height)
    );
  });

  it("project1", function () {
    const cartographic = new Cartographic(
      CesiumMath.PI,
      CesiumMath.PI_OVER_TWO,
      0.0
    );
    const expected = new Cartesian3(180.0, 90.0, 0.0);
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
    });
    expect(projection.project(cartographic)).toEqual(expected);
  });

  it("project2", function () {
    const cartographic = new Cartographic(
      -CesiumMath.PI,
      CesiumMath.PI_OVER_TWO,
      0.0
    );
    const expected = new Cartesian3(-180.0, 90.0, 0.0);
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
    });
    expect(projection.project(cartographic)).toEqual(expected);
  });

  it("project3", function () {
    const cartographic = new Cartographic(
      CesiumMath.PI,
      CesiumMath.PI_OVER_TWO,
      0.0
    );
    const expected = new Cartesian3(CesiumMath.PI, CesiumMath.PI_OVER_TWO, 0.0);
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
      degrees: false,
    });
    expect(projection.project(cartographic)).toEqual(expected);
  });

  it("project4", function () {
    const cartographic = new Cartographic(
      -CesiumMath.PI,
      CesiumMath.PI_OVER_TWO,
      0.0
    );
    const expected = new Cartesian3(
      -CesiumMath.PI,
      CesiumMath.PI_OVER_TWO,
      0.0
    );
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
      degrees: false,
    });
    expect(projection.project(cartographic)).toEqual(expected);
  });

  it("project with result parameter", function () {
    const cartographic = new Cartographic(
      CesiumMath.PI,
      CesiumMath.PI_OVER_TWO,
      0.0
    );
    const expected = new Cartesian3(CesiumMath.PI, CesiumMath.PI_OVER_TWO, 0.0);
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
      degrees: false,
    });
    const result = new Cartesian3(0.0, 0.0, 0.0);
    const returnValue = projection.project(cartographic, result);
    expect(result).toBe(returnValue);
    expect(result).toEqual(expected);
  });

  it("unproject", function () {
    const cartographic = new Cartographic(
      CesiumMath.PI_OVER_TWO,
      CesiumMath.PI_OVER_FOUR,
      12.0
    );
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
    });
    const projected = projection.project(cartographic);
    expect(projection.unproject(projected)).toEqual(cartographic);
  });

  it("unproject with result parameter", function () {
    const cartographic = new Cartographic(
      CesiumMath.PI_OVER_TWO,
      CesiumMath.PI_OVER_FOUR,
      12.0
    );
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
    });
    const projected = projection.project(cartographic);
    const result = new Cartographic(0.0, 0.0, 0.0);
    const returnValue = projection.unproject(projected, result);
    expect(result).toBe(returnValue);
    expect(
      Cartographic.equalsEpsilon(result, cartographic, CesiumMath.EPSILON10)
    ).toBe(true);
  });

  it("project throws without cartographic", function () {
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
    });
    expect(function () {
      return projection.project();
    }).toThrowDeveloperError();
  });

  it("unproject throws without cartesian", function () {
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
    });
    expect(function () {
      return projection.unproject();
    }).toThrowDeveloperError();
  });

  it("serializes and deserializes", function () {
    const projection = new Matrix4Projection({
      matrix: Matrix4.IDENTITY,
      ellipsoid: Ellipsoid.UNIT_SPHERE,
      degrees: false,
    });
    const serialized = projection.serialize();

    return Matrix4Projection.deserialize(serialized).then(function (
      deserializedProjection
    ) {
      expect(projection.matrix).toEqual(deserializedProjection.matrix);
      expect(
        projection.ellipsoid.equals(deserializedProjection.ellipsoid)
      ).toBe(true);
      expect(projection.degrees).toEqual(deserializedProjection.degrees);
    });
  });
});
