/**
 * =============================================================
 * BANU & BARIŞ DÜĞÜN DAVETİYESİ
 * Google Apps Script - Google Sheets Entegrasyonu
 * =============================================================
 *
 * KURULUM:
 * 1. Google Sheets'te yeni bir tablo oluşturun
 * 2. İlk satıra şu başlıkları yazın:
 *    A1: Tarih | B1: Ad Soyad | C1: Katılım Durumu | D1: Kişi Sayısı
 * 3. Extensions > Apps Script'e gidin
 * 4. Bu dosyanın içeriğini oraya yapıştırın
 * 5. Deploy > New deployment seçin
 * 6. Type: Web app seçin
 * 7. Execute as: Me, Who has access: Anyone seçin
 * 8. Deploy'a tıklayın ve URL'yi kopyalayın
 * 9. URL'yi script.js dosyasındaki CONFIG.googleScriptURL'e yapıştırın
 */

// POST isteklerini işle
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Yeni satır ekle
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('tr-TR'),
      data.fullname || '',
      data.attendance || '',
      data.guests || '0'
    ]);

    // Başarılı yanıt
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Hata yanıtı
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET isteklerini işle (test amaçlı)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', message: 'Düğün davetiyesi API çalışıyor!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Sheets başlıklarını otomatik oluştur (ilk kez çalıştırın)
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = ['Tarih', 'Ad Soyad', 'Katılım Durumu', 'Kişi Sayısı'];

  // Başlıkları yaz
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Başlıkları kalınlaştır ve arka plan rengi ver
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2d5016');
  headerRange.setFontColor('#ffffff');

  // Sütun genişliklerini ayarla
  sheet.setColumnWidth(1, 180); // Tarih
  sheet.setColumnWidth(2, 200); // Ad Soyad
  sheet.setColumnWidth(3, 150); // Katılım Durumu
  sheet.setColumnWidth(4, 100); // Kişi Sayısı

  // İlk satırı dondur
  sheet.setFrozenRows(1);
}
