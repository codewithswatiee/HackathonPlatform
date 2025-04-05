import cv2
import dlib
import requests
import base64

face_detector = dlib.get_frontal_face_detector()

color = str(input("Entrer yor favourite color"))
glasses = str(input("Glases? Yes/No"))
vibe = str(input("Vibe"))
headgear = str(input("Enter your Headgear"))
animal = str(input("Spirit Animal?"))

questions = {
    "favorite_color": color,
    "wear_glasses": glasses,
    "vibe": vibe,
    "headgear": headgear,
    "spirit_animal": animal
}

def traits_to_prompt(traits):
    return f"A cartoon avatar of a person wearing a {traits['headgear']}, glasses: {traits['wear_glasses']}, with a {traits['vibe']} vibe, favorite color {traits['favorite_color']}, spirit animal: {traits['spirit_animal']}"

cap = cv2.VideoCapture(0)
print("Press SPACE to capture image")
while True:
    ret, frame = cap.read()
    cv2.imshow('Press SPACE to capture', frame)
    if cv2.waitKey(1) & 0xFF == ord(' '):
        cv2.imwrite("input.jpg", frame)
        break

cap.release()
cv2.destroyAllWindows()

API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1"
headers = {
    "Authorization": "Bearer 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"
}

def cartoonify_with_prompt(image_path, prompt):
    with open(image_path, "rb") as img_file:
        image_bytes = img_file.read()
        base64_image = base64.b64encode(image_bytes).decode("utf-8")

    data = {
        "inputs": prompt,
        "options": {"wait_for_model": True}
    }

    print("Sending prompt to Hugging Face API...")
    response = requests.post(API_URL, headers=headers, json=data)

    if response.status_code == 200:
        with open("bitmoji_output.png", "wb") as f:
            f.write(response.content)
        print("Bitmoji saved as bitmoji_output.png")
    else:
        print("Error:", response.status_code, response.text)

prompt = traits_to_prompt(questions)
cartoonify_with_prompt("input.jpg", prompt)