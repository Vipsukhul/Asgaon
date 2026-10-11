import java.security.SecureRandom;
import java.util.Base64;

public class GenKey {
    public static void main(String[] args) {
        byte[] key256 = new byte[32]; // 256 bits
        byte[] key512 = new byte[64]; // 512 bits
        SecureRandom secureRandom = new SecureRandom();
        
        secureRandom.nextBytes(key256);
        secureRandom.nextBytes(key512);

        String base64Key256 = Base64.getEncoder().encodeToString(key256);
        String base64Key512 = Base64.getEncoder().encodeToString(key512);

        System.out.println("=================================================");
        System.out.println("Generated Secure JWT Secret Keys:");
        System.out.println("=================================================");
        System.out.println("256-bit Key (HS256): " + base64Key256);
        System.out.println("512-bit Key (HS512): " + base64Key512);
        System.out.println("=================================================");
    }
}
