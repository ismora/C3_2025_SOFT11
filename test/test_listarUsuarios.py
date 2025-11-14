from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Configurar el navegador
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

URL = "http://127.0.0.1:5500/C2-SCV0/App/front-end/usuario-listar.html"   

try:
    # 1. Abrir la página web
    driver.get(URL)  
    
    # 2. Esperar a que la tabla se cargue (10 segundos máximo)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "#tblUsuarios tbody tr"))
    )
    
    # 3. Obtener todas las filas de la tabla
    """
    #tblUsuarios tbody tr
    Selecciona todas las filas (`tr`) del cuerpo (`tbody`) de la tabla con id `tblUsuarios`."
    """
    filas = driver.find_elements(By.CSS_SELECTOR, "#tblUsuarios tbody tr")
    
    # 4. Verificar que haya al menos 1 fila
    assert len(filas) >= 1, "Error: La tabla no tiene datos"
    
    # 5. Obtener datos de la primera fila para verificar
    primera_fila = filas[0].find_elements(By.TAG_NAME, "td")
    
    # Verificar que los campos no estén vacíos
    assert primera_fila[0].text != "", "El correo está vacío"
    assert primera_fila[1].text != "", "La cédula está vacía"
    assert primera_fila[2].text != "", "El nombre está vacío"
    assert primera_fila[3].text != "", "Las certificaciones están vacías"
    
    print("Prueba exitosa: La tabla cargó al menos 1 dato correctamente")
    print("Datos del primer usuario:")
    print(f"Correo: {primera_fila[0].text}")
    print(f"Cédula: {primera_fila[1].text}")
    print(f"Nombre: {primera_fila[2].text}")
    print(f"Certificaciones: {primera_fila[3].text}")

except Exception as e:
    print(f"Error en la prueba: {str(e)}")
    # Captura de pantalla en caso de error
    driver.save_screenshot("error_tabla.png")
    
finally:
    # Cerrar el navegador después de 2 segundos
    time.sleep(2)
    driver.quit()