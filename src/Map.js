import React, { useEffect, useState } from "react";
import dummy from "./dummy";
import "./Map.css";

function MyMap() {
  const [timeData, setTimeData] = useState("now"); // 현재 선택된 시간대
  const [map, setMap] = useState(null);
  const [heatmapLayer, setHeatmapLayer] = useState(null);

  // Google Maps API 로드 및 지도 초기화
  useEffect(() => {
    const initMap = async () => {
      while (!window.google || !window.google.maps || !window.google.maps.visualization) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 줌 레벨별 반경 조정
      // 목적: 줌 레벨이 낮을수록 반경이 작아지며, 지도가 확대될수록 반경이 커집니다.
      const adjustRadiusByZoom = (zoomLevel) => {
        if (zoomLevel <= 5) return 7; // 줌 레벨 5 이하: 매우 작은 반경
        if (zoomLevel <= 6) return 10;
        if (zoomLevel <= 7) return 15;
        if (zoomLevel <= 8) return 20;
        if (zoomLevel <= 9) return 25;
        if (zoomLevel <= 10) return 30; // 줌 레벨 10 이상부터 점진적으로 증가
        if (zoomLevel <= 11) return 35;
        if (zoomLevel <= 12) return 40;
        if (zoomLevel <= 13) return 45;
        if (zoomLevel <= 14) return 50;
        if (zoomLevel <= 15) return 55;
        if (zoomLevel <= 16) return 60;
        return 65; // 줌 레벨 16 이상: 가장 큰 반경
      };
      // Recommondation of GPT. TODO: make it own

      // 줌 레벨별 maxIntensity 조정
      // 줌 레벨에 따라 히트맵의 maxIntensity를 동적으로 조정합니다.
      // 목적: 줌 레벨이 낮으면 더 높은 밀도를 허용하고, 확대될수록 낮은 값을 사용합니다.
      const adjustMaxIntensityByZoom = (zoomLevel) => {
        if (zoomLevel <= 5) return 5000; // 줌 레벨 5 이하: 최대 밀도
        if (zoomLevel <= 6) return 4000; // 줌 레벨 6 이하: 최대 밀도
        if (zoomLevel <= 7) return 3500; // 줌 레벨 7 이하: 최대 밀도
        if (zoomLevel <= 8) return 3000;  // 줌 레벨 8
        if (zoomLevel <= 9) return 2000;  // 줌 레벨 9
        if (zoomLevel <= 10) return 1000;  // 줌 레벨 10
        if (zoomLevel <= 11) return 500;  // 줌 레벨 11
        if (zoomLevel <= 12) return 200; // 줌 레벨 12
        if (zoomLevel <= 13) return 120; // 줌 레벨 13
        if (zoomLevel <= 14) return 100;  // 줌 레벨 14
        if (zoomLevel <= 15) return 70;  // 줌 레벨 15
        return 50;                      // 줌 레벨 16, 17이상: 세부 표현
      };
      //기본 14

      // 줌 레벨별 클러스터 크기 및 데이터 계산
      // 목적: 줌 레벨에 따라 클러스터링 크기를 조정하며, 좋음 및 나쁨 비율을 계산해 색상을 결정합니다.
      const clusterData = (data, zoom) => {
        // 클러스터 크기 정의
        const clusterSizes = {
          5: 2.0, // 줌 레벨 5: 대규모 클러스터
          6: 1.8,
          7: 1.5,
          8: 1.5,
          9: 1.1, // 줌 레벨 9: 중간 클러스터
          10: 1.08,
          11: 1.05,
          12: 1.02, // 줌 레벨 12~13: 세부 클러스터
          13: 1.01,
        };
        const clusterSize = clusterSizes[zoom] || 0.1; // 기본값

        const clusters = {};
        // 클러스터링 데이터 생성
        data.forEach(({ location, weight }) => {
          let latCluster = Math.floor(location.lat() / clusterSize) * clusterSize;
          let lngCluster = Math.floor(location.lng() / clusterSize) * clusterSize;
          const key = ${latCluster},${lngCluster};

          if (!clusters[key]) {
            clusters[key] = { count: 0, totalWeight: 0, goodCount: 0, badCount: 0 };
          }

          clusters[key].count += 1;
          clusters[key].totalWeight += weight;

          if (weight <= 30) {
            clusters[key].goodCount += 1; // 좋음
          } else {
            clusters[key].badCount += 1; // 나쁨
          }
        });

        // 클러스터링 결과 반환
        return Object.entries(clusters).map(([key, value]) => {
          const [lat, lng] = key.split(",").map(Number);
          const goodRatio = value.goodCount / value.count;
          const badRatio = value.badCount / value.count;

          let weight;
          if (badRatio >= 0.7) {
            weight = 80; // 빨간색 (나쁨 비율 높음)
          } else if (goodRatio >= 0.7) {
            weight = 10; // 파란색 (좋음 비율 높음)
          } else {
            weight = 30; // 중간 상태
          }

          return {
            location: new window.google.maps.LatLng(lat, lng),
            weight,
          };
        });
      };

      // 히트맵 데이터 업데이트
      const updateHeatmap = (data) => {
        if (heatmapLayer) {
          heatmapLayer.setMap(null);
        }

        const zoom = map.getZoom();
        const heatmapData =
          zoom >= 5
            ? data.map((d) => ({
                location: d.location,
                weight: d.weight,
              }))
            : clusterData(data, zoom);

        const newHeatmapLayer = new window.google.maps.visualization.HeatmapLayer({
          data: heatmapData.map((d) => ({
            location: d.location,
            weight: d.weight,
          })),
          map,
          radius: adjustRadiusByZoom(zoom),
          opacity: 0.6,
          gradient: [
            "rgba(0, 255, 255, 0)", // 투명 파란색
            "rgba(0, 0, 255, 0.4)", // 파란색 (좋음)
            "rgba(0, 255, 0, 0.7)", // 초록색
            "rgba(255, 255, 0, 0.8)", // 노란색
            "rgba(255, 165, 0, 0.9)", // 주황색
            "rgba(255, 0, 0, 1.0)", // 빨간색 (매우 나쁨)
          ],
        });

        setHeatmapLayer(newHeatmapLayer);
      };

      // 지도 초기화 및 사용자 위치 설정
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            const googleMap = new window.google.maps.Map(document.getElementById("map"), {
              center: userLocation,
              zoom: 14,
              mapId: "690be8e18b786646",
              minZoom: 5,
              maxZoom: 17,
            });

            setMap(googleMap);

            new window.google.maps.Marker({
              position: userLocation,
              map: googleMap,
              title: "Your Location",
            });

            // 초기 히트맵 데이터 업데이트
            const initialData = dummy().filter((d) => d.time === timeData);
            updateHeatmap(initialData);

            map.addListener("zoom_changed", () => {
              const zoomData = dummy().filter((d) => d.time === timeData);
              updateHeatmap(zoomData);
            });
          },
          (error) => {
            console.error("Error fetching geolocation:", error);
            alert("위치 정보를 가져오지 못했습니다.");
          }
        );
      }
    };

    initMap();
  }, [timeData]);

  // 시간대 변경 핸들러
  const handleTimeChange = (time) => {
    setTimeData(time);
    const newData = dummy().filter((d) => d.time === time);
    if (map) {
      const zoomData = dummy().filter((d) => d.time === time);
      updateHeatmap(zoomData);
    }
  };

  return (
    <div className="map-container">
      <h1 className="map-title">AIRSPOT.GLOBAL</h1>
      <hr className="hr_line" />
      <div className="button-group">
        <button onClick={() => handleTimeChange("now")}>현재</button>
        <button onClick={() => handleTimeChange("1hourAgo")}>1시간 전</button>
        <button onClick={() => handleTimeChange("2hoursAgo")}>2시간 전</button>
      </div>
      <div className="map-box">
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
      </div>
    </div>
  );
}

export default MyMap;