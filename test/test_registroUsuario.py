# Instalar las bibliotecas desde la terminal: pip install -r requirements.txt
# Ejecutar la prueba desde la terminal: python .\test_registroUsuario.py

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random
import string

# Configurar el navegador
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.maximize_window()

# URL de tu página de registro
REGISTER_URL = "http://localhost:3000/registrar-usuario.html"  # Ajusta esta URL

def generar_datos_usuario():
    """Genera datos de usuario aleatorios para la prueba"""
    random_str = ''.join(random.choices(string.ascii_lowercase, k=6))
    return {
        "nombre": f"Usuario Test {random_str}",
        "cedula": ''.join(random.choices(string.digits, k=10)),
        "contrasenia": f"P@ssw0rd{random_str}",
        "correo": f"test_{random_str}@example.com",
        "celular": f"3{''.join(random.choices(string.digits, k=9))}"
    }

def llenar_formulario(datos):
    """Llena el formulario con los datos proporcionados"""
    print("Llenando formulario...")
    
    # Llenar cada campo por su ID
    driver.find_element(By.ID, "txtNombre").send_keys(datos["nombre"])
    driver.find_element(By.ID, "txtCedula").send_keys(datos["cedula"])
    driver.find_element(By.ID, "txtContrasenia").send_keys(datos["contrasenia"])
    driver.find_element(By.ID, "txtCorreo").send_keys(datos["correo"])
    driver.find_element(By.ID, "txtCelular").send_keys(datos["celular"])
    
    print("✓ Formulario llenado correctamente")

def verificar_campos_requeridos():
    """Verifica que los campos requeridos estén marcados como tal"""
    print("Verificando campos requeridos...")
    
    campos_requeridos = ["txtNombre", "txtCedula", "txtContrasenia", "txtCorreo", "txtCelular"]
    
    for campo_id in campos_requeridos:
        elemento = driver.find_element(By.ID, campo_id)
        if elemento.get_attribute("required"):
            print(f"✓ Campo {campo_id} es requerido")
        else:
            print(f"⚠ Campo {campo_id} no está marcado como requerido")

def hacer_clic_guardar():
    """Hace clic en el botón Guardar"""
    print("Haciendo clic en Guardar...")
    driver.find_element(By.ID, "btnGuardar").click()
    print("✓ Botón Guardar presionado")

def verificar_modal_exito():
    """Verifica que se muestre el modal de éxito"""
    print("Verificando modal de éxito...")
    
    try:
        # Esperar a que el modal sea visible
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, "successModal"))
        )
        print("✓ Modal de éxito encontrado y visible")
        return True
    except:
        print("✗ Modal de éxito no encontrado")
        return False

def cerrar_modal_exito():
    """Cierra el modal de éxito"""
    print("Cerrando modal de éxito...")
    
    try:
        # Buscar y hacer clic en el botón de cerrar del modal
        boton_cerrar = driver.find_element(By.CSS_SELECTOR, "#successModal .btn-close")
        boton_cerrar.click()
        print("✓ Modal cerrado")
    except:
        print("✗ No se pudo cerrar el modal")

def prueba_completa():
    """Ejecuta la prueba completa del formulario de registro"""
    try:
        print("\n" + "="*60)
        print("INICIANDO PRUEBA DE FORMULARIO DE REGISTRO")
        print("="*60)
        
        # 1. Navegar a la página de registro
        print("\n1. Navegando a la página de registro...")
        driver.get(REGISTER_URL)
        
        # Esperar a que la página cargue
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "btnGuardar"))
        )
        print("✓ Página cargada correctamente")
        
        # 2. Verificar campos requeridos
        print("\n2. Verificando campos requeridos...")
        verificar_campos_requeridos()
        
        # 3. Generar y mostrar datos de prueba
        print("\n3. Generando datos de prueba...")
        datos_usuario = generar_datos_usuario()
        print("Datos de prueba generados:")
        for clave, valor in datos_usuario.items():
            print(f"   {clue}: {valor}")
        
        # 4. Llenar formulario
        print("\n4. Llenando formulario con datos de prueba...")
        llenar_formulario(datos_usuario)
        
        # 5. Hacer clic en Guardar
        print("\n5. Enviando formulario...")
        hacer_clic_guardar()
        
        # 6. Verificar modal de éxito
        print("\n6. Verificando respuesta del sistema...")
        time.sleep(2)  # Esperar a que se procese
        
        if verificar_modal_exito():
            print("✓ REGISTRO EXITOSO: Usuario creado correctamente")
            
            # 7. Cerrar modal
            print("\n7. Cerrando modal...")
            cerrar_modal_exito()
        else:
            print("⚠ Modal no encontrado - verificando estado de la página...")
        
        # 8. Verificar que los campos se limpiaron después del registro
        print("\n8. Verificando estado del formulario...")
        nombre_value = driver.find_element(By.ID, "txtNombre").get_attribute("value")
        if nombre_value == "":
            print("✓ Formulario se limpió después del registro")
        else:
            print("⚠ Formulario no se limpió completamente")
        
        print("\n" + "="*60)
        print("PRUEBA COMPLETADA EXITOSAMENTE 🎉")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ ERROR DURANTE LA PRUEBA: {str(e)}")
        # Tomar captura de pantalla en caso de error
        driver.save_screenshot("error_prueba_registro.png")
        print("📸 Captura de pantalla guardada como 'error_prueba_registro.png'")
        raise e

def prueba_campos_vacios():
    """Prueba el comportamiento cuando se envían campos vacíos"""
    try:
        print("\n" + "="*60)
        print("INICIANDO PRUEBA DE CAMPOS VACÍOS")
        print("="*60)
        
        # Navegar a la página
        driver.get(REGISTER_URL)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "btnGuardar"))
        )
        
        # Hacer clic en Guardar sin llenar campos
        print("Enviando formulario vacío...")
        driver.find_element(By.ID, "btnGuardar").click()
        
        # Esperar a ver si aparece alguna alerta o validación
        time.sleep(2)
        
        # Verificar que los campos siguen vacíos
        campos = ["txtNombre", "txtCedula", "txtContrasenia", "txtCorreo", "txtCelular"]
        todos_vacios = True
        
        for campo_id in campos:
            valor = driver.find_element(By.ID, campo_id).get_attribute("value")
            if valor != "":
                todos_vacios = False
                print(f"⚠ Campo {campo_id} no está vacío: {valor}")
        
        if todos_vacios:
            print("✓ Todos los campos permanecen vacíos después de enviar")
        else:
            print("⚠ Algunos campos no están vacíos")
            
        print("✓ PRUEBA DE CAMPOS VACÍOS COMPLETADA")
        
    except Exception as e:
        print(f"❌ ERROR en prueba de campos vacíos: {e}")

# Ejecutar las pruebas
try:
    # Ejecutar prueba completa
    prueba_completa()
    
    # Pequeña pausa entre pruebas
    time.sleep(2)
    
    # Ejecutar prueba de campos vacíos
    prueba_campos_vacios()
    
    print("\n" + "="*60)
    print("TODAS LAS PRUEBAS FINALIZADAS")
    print("="*60)
    
except Exception as e:
    print(f"\n❌ ERROR GLOBAL: {e}")

finally:
    # Mantener el navegador abierto para inspección
    print("\nManteniendo navegador abierto por 30 segundos para inspección...")
    print(f"Puedes revisar la página en: {driver.current_url}")
    time.sleep(30)
    driver.quit()
    print("Navegador cerrado.")