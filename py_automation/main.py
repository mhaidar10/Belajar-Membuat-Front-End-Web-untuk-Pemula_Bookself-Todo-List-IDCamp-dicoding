import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
import threading

# Path to the CSV file
csv_file_path = 'data.csv'

# Load CSV data
df = pd.read_csv(csv_file_path)

# Function to fill the form
def fill_form(title, writer_name, year, is_checked):
    # Click the button to add a book
    add_button = driver.find_element(By.XPATH, "/html/body/div[1]/button")
    add_button.click()

    # Input Title
    title_input = driver.find_element(By.XPATH, "/html/body/div[2]/div/form/div[1]/input")
    title_input.send_keys(title)

    # Input Writer Name
    writer_name_input = driver.find_element(By.XPATH, "/html/body/div[2]/div/form/div[2]/input")
    writer_name_input.send_keys(writer_name)

    # Input Year
    year_input = driver.find_element(By.XPATH, "/html/body/div[2]/div/form/div[3]/input")
    year_input.send_keys(str(year))

    # Check or uncheck the checkbox based on is_checked value
    checkbox = driver.find_element(By.XPATH, "/html/body/div[2]/div/form/div[4]/input")
    if is_checked:
        if not checkbox.is_selected():
            checkbox.click()
    else:
        if checkbox.is_selected():
            checkbox.click()

    # Submit the form
    submit_button = driver.find_element(By.XPATH, "/html/body/div[2]/div/form/button")
    submit_button.click()

# Function to quit the browser
def quit_browser():
    global driver
    input("Press '@' and Enter to close the browser...")
    driver.quit()

# Initialize Chrome WebDriver
driver = webdriver.Chrome()

# Open the website
driver.get("https://mhaidar10.github.io/Bookshelf-TodoList/")

# Wait for the website to load
time.sleep(2)

# Start a thread to listen for input and quit the browser
quit_thread = threading.Thread(target=quit_browser)
quit_thread.start()

# Iterate over rows in the DataFrame and fill the form
for index, row in df.iterrows():
    fill_form(row['Title'], row['Writer Name'], row['Year'], row['IsChecked'])
