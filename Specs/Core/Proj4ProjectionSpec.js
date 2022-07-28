import { Proj4Projection } from "../../Source/Cesium.js";
import { Cartesian3 } from "../../Source/Cesium.js";
import { Cartographic } from "../../Source/Cesium.js";
import { Ellipsoid } from "../../Source/Cesium.js";
import { Math as CesiumMath } from "../../Source/Cesium.js";
import { Rectangle } from "../../Source/Cesium.js";

describe("Core/Proj4Projection", function () {
  const mollweideWellKnownText =
    "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs";
  const webMercatorWellKnownText =
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
  const webMercatorProjectedBounds = new Rectangle(
    -20026376.39,
    -20048966.1,
    20026376.39,
    20048966.1
  );
  const westernHemisphere = Rectangle.fromDegrees(-180, -90, 0, 90);

  it("throws without wellKnownText", function () {
    expect(function () {
      return new Proj4Projection();
    }).toThrowDeveloperError();
  });

  it("construct0", function () {
    const projection = new Proj4Projection({
      wellKnownText: mollweideWellKnownText,
    });
    expect(projection.wellKnownText).toEqual(mollweideWellKnownText);
    expect(projection.ellipsoid).toEqual(Ellipsoid.WGS84);
    expect(projection.heightScale).toEqual(1.0);
    expect(projection.wgs84Bounds).toEqual(Rectangle.MAX_VALUE);
  });

  it("construct1", function () {
    const projection = new Proj4Projection({
      wellKnownText: mollweideWellKnownText,
      wgs84Bounds: westernHemisphere,
    });
    expect(projection.wellKnownText).toEqual(mollweideWellKnownText);
    expect(projection.ellipsoid).toEqual(Ellipsoid.WGS84);
    expect(projection.heightScale).toEqual(1.0);
    expect(projection.wgs84Bounds).toEqual(westernHemisphere);
  });

  it("construct2", function () {
    const projection = new Proj4Projection({
      wellKnownText: mollweideWellKnownText,
      wgs84Bounds: westernHemisphere,
      heightScale: 0.5,
    });
    expect(projection.wellKnownText).toEqual(mollweideWellKnownText);
    expect(projection.ellipsoid).toEqual(Ellipsoid.WGS84);
    expect(projection.heightScale).toEqual(0.5);
    expect(projection.wgs84Bounds).toEqual(westernHemisphere);
  });

  it("construct3", function () {
    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
      wgs84Bounds: westernHemisphere,
      heightScale: 0.5,
      projectedBounds: webMercatorProjectedBounds,
    });
    expect(projection.wellKnownText).toEqual(webMercatorWellKnownText);
    expect(projection.ellipsoid).toEqual(Ellipsoid.WGS84);
    expect(projection.heightScale).toEqual(0.5);
    expect(projection.wgs84Bounds).toEqual(westernHemisphere);
    expect(projection.projectedBounds).toEqual(webMercatorProjectedBounds);
  });

  it("project0", function () {
    const height = 10.0;
    const cartographic = new Cartographic(0.0, 0.0, height);
    const projection = new Proj4Projection({
      wellKnownText: mollweideWellKnownText,
    });
    expect(projection.project(cartographic)).toEqual(
      new Cartesian3(0.0, 0.0, height)
    );
  });

  it("project1", function () {
    const ellipsoid = Ellipsoid.WGS84;
    const cartographic = new Cartographic(
      Math.PI,
      CesiumMath.PI_OVER_FOUR,
      0.0
    );

    // expected equations from Wolfram MathWorld:
    // http://mathworld.wolfram.com/MercatorProjection.html
    const expected = new Cartesian3(
      ellipsoid.maximumRadius * cartographic.longitude,
      ellipsoid.maximumRadius *
        Math.log(Math.tan(Math.PI / 4.0 + cartographic.latitude / 2.0)),
      0.0
    );

    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
    });
    expect(projection.project(cartographic)).toEqualEpsilon(
      expected,
      CesiumMath.EPSILON8
    );
  });

  it("project2", function () {
    const ellipsoid = Ellipsoid.WGS84;
    const cartographic = new Cartographic(
      -Math.PI,
      CesiumMath.PI_OVER_FOUR,
      0.0
    );

    // expected equations from Wolfram MathWorld:
    // http://mathworld.wolfram.com/MercatorProjection.html
    const expected = new Cartesian3(
      ellipsoid.maximumRadius * cartographic.longitude,
      ellipsoid.maximumRadius *
        Math.log(Math.tan(Math.PI / 4.0 + cartographic.latitude / 2.0)),
      0.0
    );

    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
    });
    expect(projection.project(cartographic)).toEqualEpsilon(
      expected,
      CesiumMath.EPSILON8
    );
  });

  it("project3", function () {
    const ellipsoid = Ellipsoid.WGS84;
    const cartographic = new Cartographic(
      Math.PI,
      CesiumMath.PI_OVER_FOUR,
      0.0
    );

    // expected equations from Wolfram MathWorld:
    // http://mathworld.wolfram.com/MercatorProjection.html
    const expected = new Cartesian3(
      ellipsoid.maximumRadius * cartographic.longitude,
      ellipsoid.maximumRadius *
        Math.log(Math.tan(Math.PI / 4.0 + cartographic.latitude / 2.0)),
      0.0
    );

    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
    });
    const result = new Cartesian3(0.0, 0.0, 0.0);
    const returnValue = projection.project(cartographic, result);
    expect(result).toEqual(returnValue);
    expect(result).toEqualEpsilon(expected, CesiumMath.EPSILON8);
  });

  it("unproject0", function () {
    const cartographic = new Cartographic(
      CesiumMath.PI_OVER_TWO,
      CesiumMath.PI_OVER_FOUR,
      12.0
    );
    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
    });
    const projected = projection.project(cartographic);
    expect(projection.unproject(projected)).toEqualEpsilon(
      cartographic,
      CesiumMath.EPSILON14
    );
  });

  it("unproject1", function () {
    const cartographic = new Cartographic(
      CesiumMath.PI_OVER_TWO,
      CesiumMath.PI_OVER_FOUR,
      12.0
    );
    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
    });
    const projected = projection.project(cartographic);
    const result = new Cartographic(0.0, 0.0, 0.0);
    const returnValue = projection.unproject(projected, result);
    expect(result).toEqual(returnValue);
    expect(result).toEqualEpsilon(cartographic, CesiumMath.EPSILON14);
  });

  it("scales height", function () {
    const ellipsoid = Ellipsoid.WGS84;
    const cartographic = new Cartographic(
      Math.PI,
      CesiumMath.PI_OVER_FOUR,
      1.0
    );

    // expected equations from Wolfram MathWorld:
    // http://mathworld.wolfram.com/MercatorProjection.html
    const expected = new Cartesian3(
      ellipsoid.maximumRadius * cartographic.longitude,
      ellipsoid.maximumRadius *
        Math.log(Math.tan(Math.PI / 4.0 + cartographic.latitude / 2.0)),
      0.5
    );

    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
      heightScale: 0.5,
    });
    const returnValue = projection.project(cartographic);
    expect(returnValue).toEqualEpsilon(expected, CesiumMath.EPSILON8);

    const unprojected = projection.unproject(returnValue);
    expect(unprojected).toEqualEpsilon(cartographic, CesiumMath.EPSILON8);
  });

  it("clamps cartographic coordinates to the specified wgs84 bounds", function () {
    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
      heightScale: 0.5,
      wgs84Bounds: Rectangle.fromDegrees(-180, -90, 180, 45),
    });
    const edgeProjected = projection.project(
      Cartographic.fromDegrees(0, 45, 0)
    );
    const clampedProjected = projection.project(
      Cartographic.fromDegrees(0, 50, 0)
    );

    expect(edgeProjected).toEqualEpsilon(clampedProjected, CesiumMath.EPSILON8);
  });

  it("clamps projected coordinates to the specified projected bounds", function () {
    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
      heightScale: 0.5,
      projectedBounds: webMercatorProjectedBounds,
    });
    const unprojected = projection.unproject(
      new Cartesian3(webMercatorProjectedBounds.west, 0.0, 0.0)
    );

    const projectedOutOfBounds = new Cartesian3(
      webMercatorProjectedBounds.west - 100000.0,
      0.0,
      0.0
    );
    const clampedUnprojected = projection.unproject(projectedOutOfBounds);

    expect(clampedUnprojected).toEqualEpsilon(unprojected, CesiumMath.EPSILON8);
  });

  it("project throws without cartesian", function () {
    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
    });
    expect(function () {
      return projection.unproject();
    }).toThrowDeveloperError();
  });

  it("serializes and deserializes", function () {
    const projection = new Proj4Projection({
      wellKnownText: webMercatorWellKnownText,
      heightScale: 0.5,
      projectedBounds: webMercatorProjectedBounds,
    });
    const serialized = projection.serialize();

    return Proj4Projection.deserialize(serialized).then(function (
      deserializedProjection
    ) {
      expect(
        projection.ellipsoid.equals(deserializedProjection.ellipsoid)
      ).toBe(true);
      expect(projection.wellKnownText).toEqual(
        deserializedProjection.wellKnownText
      );
      expect(projection.heightScale).toEqual(
        deserializedProjection.heightScale
      );
      expect(
        projection.wgs84Bounds.equals(deserializedProjection.wgs84Bounds)
      ).toBe(true);
      expect(
        projection.projectedBounds.equals(
          deserializedProjection.projectedBounds
        )
      ).toBe(true);
    });
  });
});
