import React, { useState, useEffect } from 'react';

function TouristInfo() {
  const [dataset, setDataset] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6')
      .then((res) => res.json())
      .then((json) => {
        setDataset(json);
        setFilteredData(json);
      })
      .catch((err) => {
        console.error('資料載入失敗', err);
        alert('資料載入失敗，請稍後再試。');
      });
  }, []);

  useEffect(() => {
    const filtered = dataset.filter(item =>
      item.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); 
  }, [searchKeyword]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ padding: '20px' }}>
      <h1>景點觀光展覽資訊</h1>

      <input
        type="text"
        placeholder="請輸入名稱關鍵字"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ marginRight: '10px', padding: '6px' }}
      />
      <button onClick={() => setCurrentPage(1)}>搜尋</button>

      <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>名稱</th>
            <th>地點</th>
            <th>票價</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr key={index}>
                <td>{startIndex + index + 1}</td>
                <td>{item.title}</td>
                <td>{item.showInfo?.[0]?.location || '未知地點'}</td>
                <td>{item.showInfo?.[0]?.price || '未提供'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>找不到符合條件的資料</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          上一頁
        </button>

        <span style={{ margin: '0 10px' }}>
          第 {currentPage} 頁 / 共 {totalPages} 頁
        </span>

        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          下一頁
        </button>
      </div>
    </div>
  );
}

export default TouristInfo;
