import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase"; // Firestore 초기화 파일에서 가져오기

function MapComponent() {
  const [position, setPosition] = useState(null); // 사용자 현재 위치
  const [nodes, setNodes] = useState([]); // 데이터베이스에서 가져온 노드 위치

  // Geolocation API로 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]); // 현재 위치로 상태 업데이트
        },
        (error) => {
          console.error("Error fetching location: ", error);
          // 에러 발생 시 기본 위치 (서울특별시청)로 설정
          setPosition([37.5665, 126.9780]);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setPosition([37.5665, 126.9780]); // Geolocation 미지원 시 기본 위치 (서울특별시청)로 설정
    }
  }, []);

  // Firestore에서 노드 데이터 가져오기
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "nodes")); // "nodes" 컬렉션 가져오기
        const nodeData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNodes(nodeData); // 상태에 노드 데이터 저장
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    fetchNodes();
  }, []);

  if (!position) {
    // 위치를 가져오는 동안 로딩 표시
    return <div>지도 정보를 가져오는 중입니다...</div>;
  }

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
      />
      {/* 사용자 현재 위치 */}
      <Marker position={position}>
        <Popup>
          현재 위치: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </Popup>
      </Marker>

      {/* 데이터베이스 노드들 */}
      {nodes.map((node) => (
        <Marker key={node.id} position={[node.latitude, node.longitude]}>
          <Popup>
            노드 ID: {node.id}
            <br />
            상세 정보: {node.description || "설명 없음"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;
