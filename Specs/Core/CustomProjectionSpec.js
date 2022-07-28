import { CustomProjection } from "../../Source/Cesium.js";
import { Cartesian3 } from "../../Source/Cesium.js";
import { Cartographic } from "../../Source/Cesium.js";
import { Ellipsoid } from "../../Source/Cesium.js";
import { FeatureDetection } from "../../Source/Cesium.js";
import { Math as CesiumMath } from "../../Source/Cesium.js";

describe("Core/CustomProjection", function () {
  beforeEach(function () {
    CustomProjection._loadedProjectionFunctions = {};
  });

  it("construct0", function () {
    const projection = new CustomProjection("Data/UserGeographic.js");
    expect(projection.ellipsoid).toEqual(Ellipsoid.WGS84);
  });

  it("construct1", function () {
    const ellipsoid = Ellipsoid.UNIT_SPHERE;
    const projection = new CustomProjection(
      "Data/UserGeographic.js",
      ellipsoid
    );
    expect(projection.ellipsoid).toEqual(ellipsoid);
  });

  it("caches by url", function () {
    const cache = CustomProjection._loadedProjectionFunctions;
    let cachedCallback;
    const projection1 = new CustomProjection("Data/UserGeographic.js");
    return projection1.readyPromise
      .then(function () {
        expect(Object.keys(cache).length).toEqual(1);
        cachedCallback = cache[Object.keys(cache)[0]];

        const projection2 = new CustomProjection("Data/UserGeographic.js");
        return projection2.readyPromise;
      })
      .then(function () {
        expect(Object.keys(cache).length).toEqual(1);
        expect(cache[Object.keys(cache)[0]]).toBe(cachedCallback);
      });
  });

  it("does not cache by data URIs", function () {
    if (FeatureDetection.isInternetExplorer()) {
      return;
    }
    const dataUri =
      "data:text/javascript;base64,ZnVuY3Rpb24gY3JlYXRlUHJvamVjdGlvbkZ1bmN0aW9ucyhjYWxsYmFjayl7ZnVuY3Rpb24gcHJvamVjdChjYXJ0b2dyYXBoaWMscmVzdWx0KXtyZXN1bHQueD1jYXJ0b2dyYXBoaWMubG9uZ2l0dWRlKjYzNzgxMzcuMDtyZXN1bHQueT1jYXJ0b2dyYXBoaWMubGF0aXR1ZGUqNjM3ODEzNy4wO3Jlc3VsdC56PWNhcnRvZ3JhcGhpYy5oZWlnaHQ7fWZ1bmN0aW9uIHVucHJvamVjdChjYXJ0ZXNpYW4scmVzdWx0KXtyZXN1bHQubG9uZ2l0dWRlPWNhcnRlc2lhbi54LzYzNzgxMzcuMDtyZXN1bHQubGF0aXR1ZGU9Y2FydGVzaWFuLnkvNjM3ODEzNy4wO3Jlc3VsdC5oZWlnaHQ9Y2FydGVzaWFuLno7fWNhbGxiYWNrKHByb2plY3QsdW5wcm9qZWN0KTt9";
    const cache = CustomProjection._loadedProjectionFunctions;
    const projection1 = new CustomProjection(dataUri);
    return projection1.readyPromise.then(function () {
      expect(cache[dataUri]).not.toBeDefined();
    });
  });

  it("project0", function () {
    const height = 10.0;
    const cartographic = new Cartographic(0.0, 0.0, height);
    const projection = new CustomProjection("Data/UserGeographic.js");
    return projection.readyPromise.then(function () {
      expect(projection.project(cartographic)).toEqual(
        new Cartesian3(0.0, 0.0, height)
      );
    });
  });

  it("project1", function () {
    const ellipsoid = Ellipsoid.WGS84;
    const cartographic = new Cartographic(Math.PI, CesiumMath.PI_OVER_TWO, 0.0);
    const expected = new Cartesian3(
      Math.PI * ellipsoid.radii.x,
      CesiumMath.PI_OVER_TWO * ellipsoid.radii.x,
      0.0
    );
    const projection = new CustomProjection(
      "Data/UserGeographic.js",
      ellipsoid
    );
    return projection.readyPromise.then(function () {
      expect(projection.project(cartographic)).toEqual(expected);
    });
  });

  it("project2", function () {
    const ellipsoid = Ellipsoid.WGS84;
    const cartographic = new Cartographic(
      -Math.PI,
      CesiumMath.PI_OVER_TWO,
      0.0
    );
    const expected = new Cartesian3(
      -Math.PI * ellipsoid.radii.x,
      CesiumMath.PI_OVER_TWO * ellipsoid.radii.x,
      0.0
    );
    const projection = new CustomProjection(
      "Data/UserGeographic.js",
      ellipsoid
    );
    return projection.readyPromise.then(function () {
      expect(projection.project(cartographic)).toEqual(expected);
    });
  });

  it("project with result parameter", function () {
    const ellipsoid = Ellipsoid.WGS84;
    const cartographic = new Cartographic(Math.PI, CesiumMath.PI_OVER_TWO, 0.0);
    const expected = new Cartesian3(
      Math.PI * ellipsoid.radii.x,
      CesiumMath.PI_OVER_TWO * ellipsoid.radii.x,
      0.0
    );
    const projection = new CustomProjection(
      "Data/UserGeographic.js",
      ellipsoid
    );
    return projection.readyPromise.then(function () {
      const result = new Cartesian3(0.0, 0.0, 0.0);
      const returnValue = projection.project(cartographic, result);
      expect(result).toBe(returnValue);
      expect(result).toEqual(expected);
    });
  });

  it("unproject", function () {
    const cartographic = new Cartographic(
      CesiumMath.PI_OVER_TWO,
      CesiumMath.PI_OVER_FOUR,
      12.0
    );
    const projection = new CustomProjection("Data/UserGeographic.js");
    return projection.readyPromise.then(function () {
      const projected = projection.project(cartographic);
      expect(
        Cartographic.equalsEpsilon(
          projection.unproject(projected),
          cartographic,
          CesiumMath.EPSILON10
        )
      ).toBe(true);
    });
  });

  it("unproject with result parameter", function () {
    const cartographic = new Cartographic(
      CesiumMath.PI_OVER_TWO,
      CesiumMath.PI_OVER_FOUR,
      12.0
    );
    const projection = new CustomProjection("Data/UserGeographic.js");
    return projection.readyPromise.then(function () {
      const projected = projection.project(cartographic);
      const result = new Cartographic(0.0, 0.0, 0.0);
      const returnValue = projection.unproject(projected, result);
      expect(result).toBe(returnValue);
      expect(
        Cartographic.equalsEpsilon(result, cartographic, CesiumMath.EPSILON10)
      ).toBe(true);
    });
  });

  it("project throws without cartographic", function () {
    const projection = new CustomProjection("Data/UserGeographic.js");
    return projection.readyPromise.then(function () {
      expect(function () {
        return projection.project();
      }).toThrowDeveloperError();
    });
  });

  it("unproject throws without cartesian", function () {
    const projection = new CustomProjection("Data/UserGeographic.js");
    return projection.readyPromise.then(function () {
      expect(function () {
        return projection.unproject();
      }).toThrowDeveloperError();
    });
  });

  it("provides a ready accessor", function () {
    const projection = new CustomProjection("Data/UserGeographic.js");
    expect(projection.ready).toBe(false);
    return projection.readyPromise.then(function () {
      expect(projection.ready).toBe(true);
    });
  });

  it("throws when custom projection is not yet loaded", function () {
    const projection = new CustomProjection("Data/UserGeographic.js");
    expect(projection.ready).toBe(false);
    expect(function () {
      const cartographic = new Cartographic(
        -Math.PI,
        CesiumMath.PI_OVER_TWO,
        0.0
      );
      projection.project(cartographic);
    }).toThrowDeveloperError();
  });

  it("rejects readyPromise when custom projection cannot be loaded", function () {
    const projection = new CustomProjection("fake/path");
    return projection.readyPromise
      .then(function () {
        fail("should not resolve");
      })
      .otherwise(function (e) {
        expect(projection.ready).toBe(false);
        expect(e.message).toContain("Unable to load projection source from");
        expect(e.message).toContain("fake/path");
      });
  });

  it("rejects readyPromise when custom projection is missing createProjectionFunction", function () {
    const projection = new CustomProjection(
      "Data/UserProjectionNoCreateProjectionFunctions.js"
    );
    return projection.readyPromise
      .then(function () {
        fail("should not resolve");
      })
      .otherwise(function (e) {
        expect(projection.ready).toBe(false);
        expect(e.message).toEqual(
          "projection code missing createProjectionFunctions function"
        );
      });
  });

  it("rejects readyPromise when custom projection is missing project", function () {
    const projection = new CustomProjection("Data/UserProjectionNoProject.js");
    return projection.readyPromise
      .then(function () {
        fail("should not resolve");
      })
      .otherwise(function (e) {
        expect(projection.ready).toBe(false);
        expect(e.message).toEqual("projection code missing project function");
      });
  });

  it("rejects readyPromise when custom projection is missing unproject", function () {
    const projection = new CustomProjection(
      "Data/UserProjectionNoUnproject.js"
    );
    return projection.readyPromise
      .then(function () {
        fail("should not resolve");
      })
      .otherwise(function (e) {
        expect(projection.ready).toBe(false);
        expect(e.message).toEqual("projection code missing unproject function");
      });
  });

  it("serializes and deserializes", function () {
    const projection = new CustomProjection("Data/UserGeographic.js");
    const serialized = projection.serialize();

    return CustomProjection.deserialize(serialized).then(function (
      deserializedProjection
    ) {
      expect(
        projection.ellipsoid.equals(deserializedProjection.ellipsoid)
      ).toBe(true);
      expect(projection.url).toEqual(deserializedProjection.url);

      expect(deserializedProjection.ready).toBe(true);
    });
  });
});
