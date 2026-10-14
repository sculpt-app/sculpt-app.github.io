import * as THREE from 'three';

function roundedShape(width, height, radius) {
  const x = -width / 2, y = -height / 2, s = new THREE.Shape();
  s.moveTo(x + radius, y);
  s.lineTo(x + width - radius, y); s.quadraticCurveTo(x + width, y, x + width, y + radius);
  s.lineTo(x + width, y + height - radius); s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  s.lineTo(x + radius, y + height); s.quadraticCurveTo(x, y + height, x, y + height - radius);
  s.lineTo(x, y + radius); s.quadraticCurveTo(x, y, x + radius, y);
  return s;
}
function face(width, height, radius, material, name, z) {
  const geometry = new THREE.ShapeGeometry(roundedShape(width, height, radius), 20);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (position.getX(i) + width / 2) / width, 1 - (position.getY(i) + height / 2) / height);
  const mesh = new THREE.Mesh(geometry, material); mesh.name = name; mesh.position.z = z;
  return mesh;
}
export function createPhoneModel() {
  const phone = new THREE.Group(); phone.name = 'Sculpt iPhone';
  const titanium = new THREE.MeshStandardMaterial({ color: '#b3b2ad', metalness: 0.88, roughness: 0.27 });
  const black = new THREE.MeshStandardMaterial({ color: '#0a0b0b', metalness: 0.2, roughness: 0.23 });
  const ceramic = new THREE.MeshStandardMaterial({ color: '#e4e3de', metalness: 0.16, roughness: 0.31 });
  const shell = new THREE.ExtrudeGeometry(roundedShape(2.5, 5.42, 0.4), { depth: 0.2, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.023, bevelSegments: 3, curveSegments: 20, steps: 1 });
  shell.translate(0, 0, -0.1);
  const body = new THREE.Mesh(shell, titanium); body.name = 'Titanium frame'; phone.add(body);
  phone.add(face(2.47, 5.39, 0.395, black, 'Front bezel', 0.127));
  const display = face(2.32, 5.16, 0.32, new THREE.MeshBasicMaterial({ color: 0xffffff }), 'SculptDisplay', 0.134);
  phone.add(display);
  const island = face(0.68, 0.19, 0.095, new THREE.MeshBasicMaterial({ color: '#060707' }), 'DynamicIsland', 0.141);
  island.position.y = 2.30; phone.add(island);
  const rear = face(2.45, 5.37, 0.38, ceramic, 'Back glass', -0.129); rear.rotation.y = Math.PI; phone.add(rear);
  const cameraPlate = face(0.95, 1.12, 0.17, ceramic, 'Camera housing', -0.17);
  cameraPlate.position.set(0.64, 1.90, -0.17); cameraPlate.rotation.y = Math.PI; phone.add(cameraPlate);
  const lensMaterial = new THREE.MeshStandardMaterial({ color: '#111b25', roughness: 0.15, metalness: 0.6 });
  for (const [x, y] of [[0.42, 2.17], [0.86, 1.92], [0.42, 1.68]]) {
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.06, 36), titanium);
    rim.rotation.x = Math.PI / 2; rim.position.set(x, y, -0.205); phone.add(rim);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.156, 36), lensMaterial);
    lens.rotation.y = Math.PI; lens.position.set(x, y, -0.24); phone.add(lens);
  }
  const flash = new THREE.Mesh(new THREE.CircleGeometry(0.07, 24), new THREE.MeshBasicMaterial({ color: '#f6f5ea' }));
  flash.rotation.y = Math.PI; flash.position.set(0.85, 2.28, -0.21); phone.add(flash);
  for (const [x, y, height] of [[-1.264, 1.55, 0.22], [-1.264, 0.86, 0.46], [-1.264, 0.22, 0.46], [1.264, 0.7, 0.7]]) {
    const button = new THREE.Mesh(new THREE.BoxGeometry(0.035, height, 0.10), titanium);
    button.position.set(x, y, 0); phone.add(button);
  }
  const port = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.011, 0.07), black);
  port.position.set(0, -2.739, 0); phone.add(port);
  return phone;
}
