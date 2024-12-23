import React, { useEffect } from "react";
import { firestore } from "./firebase"; // Firebase 설정 파일에서 가져오기
import { collection, getDocs } from "firebase/firestore";
import "./Map.css";

function MyMap() {
  useEffect(() => {
    const initMap = async () => {
      while (!window.google || !window.google.maps || !window.google.maps.visualization) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const fetchData = async () => {
        const snapshot = await getDocs(collection(firestore, "nodes")); // Firestore에서 데이터 가져오기
        const data = [];
        snapshot.forEach((doc) => {
          const { latitude, longitude, pm25 } = doc.data();
          data.push({
            location: new window.google.maps.LatLng(latitude, longitude),
            weight: pm25,
          });
        });
        return data;
      };

      const heatmapData = await fetchData();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            const map = new window.google.maps.Map(document.getElementById("map"), {
              center: userLocation,
              zoom: 9,
              mapId: "690be8e18b786646",
            });

            new window.google.maps.visualization.HeatmapLayer({
              data: heatmapData, // Firestore에서 가져온 데이터
              map, // Google Maps 인스턴스
              radius: 20, // 히트맵의 반경
              opacity: 0.6, // 히트맵의 투명도
            });

            new window.google.maps.Marker({
              position: userLocation,
              map,
              title: "Your Location",
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
  }, []);

  return (
    <div className="map-container">
      <h1 className="map-title">AIRSPOT.GLOBAL</h1><hr className="hr_line"></hr>
      <div className="map-box">
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
      </div>
    </div>
  );
}

export default MyMap;
