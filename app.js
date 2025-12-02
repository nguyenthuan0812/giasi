// Lưu URL tạm thời của ảnh upload
let uploadedImageURL = "";

// Xử lý upload ảnh (lưu URL nhưng không hiển thị ngay)
document.getElementById("imageInput").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) {
    uploadedImageURL = "";
    return;
  }
  uploadedImageURL = URL.createObjectURL(file);
});

// Tạo động 7 ô nhập (kích cỡ + giá vốn)
const container = document.getElementById("sizePriceInputs");
for (let i = 1; i <= 7; i++) {
  const div = document.createElement("div");
  div.className = "input-row";
  div.innerHTML = `
    <input type="text" id="size${i}" placeholder="Kích cỡ ${i} (ví dụ: 14cm)">
    <input type="number" id="price${i}" placeholder="Giá vốn ${i}" min="0">
  `;
  container.appendChild(div);
}

// Hàm tính giá sỉ: giá vốn * 1.1 và làm tròn
function tinhGiaSi(giaVon) {
  const num = Number(giaVon);
  if (isNaN(num)) return null;
  return Math.ceil(num * 1.1); // làm tròn số nguyên
}

// Khi nhấn Thực hiện
document.getElementById("generateBtn").addEventListener("click", function() {
  let lines = [];
  for (let i = 1; i <= 7; i++) {
    const size = document.getElementById(`size${i}`).value.trim();
    const price = document.getElementById(`price${i}`).value.trim();
    if (size && price) {
      const giaSi = tinhGiaSi(price);
      if (giaSi === null) continue;
      lines.push(`${size}: ${giaSi}`);
    }
  }

  // Nếu không có dòng nào thì thông báo
  const resultBox = document.getElementById("resultBox");
  if (lines.length === 0) {
    resultBox.textContent = "(Không có dữ liệu hợp lệ. Vui lòng nhập ít nhất 1 cặp kích cỡ + giá vốn.)";
  } else {
    resultBox.innerHTML = lines.join("\n");
  }

  // Hiển thị ảnh bên phải nếu có
  const imgEl = document.getElementById("resultImage");
  if (uploadedImageURL) {
    imgEl.src = uploadedImageURL;
    imgEl.style.display = "block";
  } else {
    imgEl.src = "";
    imgEl.style.display = "none";
  }
});

// Nút copy: copy toàn bộ text trong resultBox
document.getElementById("copyBtn").addEventListener("click", function() {
  const text = document.getElementById("resultBox").innerText;
  if (!text || text.includes("Không có dữ liệu")) {
    alert("Chưa có kết quả để copy.");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    alert("Đã copy kết quả vào clipboard.");
  }).catch(err => {
    alert("Copy thất bại: " + err);
  });
});

// Nút xuất .txt
document.getElementById("exportBtn").addEventListener("click", function() {
  const text = document.getElementById("resultBox").innerText;
  if (!text || text.includes("Không có dữ liệu")) {
    alert("Chưa có kết quả để xuất.");
    return;
  }
  const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gia_si.txt";
  a.click();
  URL.revokeObjectURL(url);
});
