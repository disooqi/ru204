FasdUAS 1.101.10   ��   ��    k             l     ��  ��      To load this library:     � 	 	 ,   T o   l o a d   t h i s   l i b r a r y :   
  
 l     ��  ��    Q K 1. Create the script library directory: "mkdir ~/Library/Script Libraries"     �   �   1 .   C r e a t e   t h e   s c r i p t   l i b r a r y   d i r e c t o r y :   " m k d i r   ~ / L i b r a r y / S c r i p t   L i b r a r i e s "      l     ��  ��    [ U 2. Copy this script into that directory: "cp Typist.scpt ~/Library/Script Libraries"     �   �   2 .   C o p y   t h i s   s c r i p t   i n t o   t h a t   d i r e c t o r y :   " c p   T y p i s t . s c p t   ~ / L i b r a r y / S c r i p t   L i b r a r i e s "      l     ��  ��    4 . 3. Reference this script within "tell" block:     �   \   3 .   R e f e r e n c e   t h i s   s c r i p t   w i t h i n   " t e l l "   b l o c k :      l     ��  ��           �           l     ��   !��     "  tell application "Terminal"    ! � " " 8   t e l l   a p p l i c a t i o n   " T e r m i n a l "   # $ # l     �� % &��   %     tell script "Typist"    & � ' ' .       t e l l   s c r i p t   " T y p i s t " $  ( ) ( l     �� * +��   * K E     execCmd("FT.SEARCH permits greenhouse RETURN 1", 4, false, true)    + � , , �           e x e c C m d ( " F T . S E A R C H   p e r m i t s   g r e e n h o u s e   R E T U R N   1 " ,   4 ,   f a l s e ,   t r u e ) )  - . - l     �� / 0��   /     end tell    0 � 1 1        e n d   t e l l .  2 3 2 l     �� 4 5��   4  	 end tell    5 � 6 6    e n d   t e l l 3  7 8 7 l     ��������  ��  ��   8  9 : 9 i      ; < ; I      �������� 0 	execsetup 	execSetup��  ��   < k     9 = =  > ? > O      @ A @ k     B B  C D C I   	������
�� .miscactvnull��� ��� null��  ��   D  E�� E I  
 �� F��
�� .sysodelanull��� ��� nmbr F m   
 ���� ��  ��   A m      G G�                                                                                      @ alis    J  Macintosh HD                   BD ����Terminal.app                                                   ����            ����  
 cu             	Utilities   -/:System:Applications:Utilities:Terminal.app/     T e r m i n a l . a p p    M a c i n t o s h   H D  *System/Applications/Utilities/Terminal.app  / ��   ?  H I H l   ��������  ��  ��   I  J�� J O    9 K L K k    8 M M  N O N l   �� P Q��   P   Disable hints    Q � R R    D i s a b l e   h i n t s O  S T S l   �� U V��   U 1 + my execCmd(":set nohints", 0, true, false)    V � W W V   m y   e x e c C m d ( " : s e t   n o h i n t s " ,   0 ,   t r u e ,   f a l s e ) T  X Y X l   ��������  ��  ��   Y  Z [ Z l   �� \ ]��   \   Clear screen    ] � ^ ^    C l e a r   s c r e e n [  _ ` _ O    2 a b a k    1 c c  d e d I   !�� f��
�� .prcskprsnull���     ctxt f m     g g � h h  : s e t   n o h i n t s��   e  i j i I  " '�� k��
�� .prcskprsnull���     ctxt k o   " #��
�� 
ret ��   j  l�� l I  ( 1�� m n
�� .prcskprsnull���     ctxt m m   ( ) o o � p p  l n �� q��
�� 
faal q J   * - r r  s�� s m   * +��
�� eMdsKctl��  ��  ��   b 4    �� t
�� 
pcap t m     u u � v v  T e r m i n a l `  w�� w I  3 8�� x��
�� .sysodelanull��� ��� nmbr x m   3 4���� ��  ��   L m     y y�                                                                                  sevs  alis    \  Macintosh HD                   BD ����System Events.app                                              ����            ����  
 cu             CoreServices  0/:System:Library:CoreServices:System Events.app/  $  S y s t e m   E v e n t s . a p p    M a c i n t o s h   H D  -System/Library/CoreServices/System Events.app   / ��  ��   :  z { z l     ��������  ��  ��   {  | } | l     ��������  ��  ��   }  ~  ~ l     �� � ���   � ) # This funtion takes four arguments:    � � � � F   T h i s   f u n t i o n   t a k e s   f o u r   a r g u m e n t s :   � � � l     �� � ���   � A ;   textBuffer: The text you want to be printed the Terminal    � � � � v       t e x t B u f f e r :   T h e   t e x t   y o u   w a n t   t o   b e   p r i n t e d   t h e   T e r m i n a l �  � � � l     �� � ���   � N H   pause: The amount of time in seconds to pause after printing the text    � � � � �       p a u s e :   T h e   a m o u n t   o f   t i m e   i n   s e c o n d s   t o   p a u s e   a f t e r   p r i n t i n g   t h e   t e x t �  � � � l     �� � ���   � J D   r: Whether to include a "return" keystroke at the end of the text    � � � � �       r :   W h e t h e r   t o   i n c l u d e   a   " r e t u r n "   k e y s t r o k e   a t   t h e   e n d   o f   t h e   t e x t �  � � � l     �� � ���   � X R   dodelay: Whether to insert a random delay between keystrokes to simulate typing    � � � � �       d o d e l a y :   W h e t h e r   t o   i n s e r t   a   r a n d o m   d e l a y   b e t w e e n   k e y s t r o k e s   t o   s i m u l a t e   t y p i n g �  � � � i     � � � I      �� ����� 0 execcmd execCmd �  � � � o      ���� 0 
textbuffer 
textBuffer �  � � � o      ���� 	0 pause   �  � � � o      ���� 0 r   �  ��� � o      ���� 0 dodelay  ��  ��   � k     t � �  � � � O     n � � � O    m � � � k    l � �  � � � r     � � � m    ��
�� boovtrue � 1    ��
�� 
pisf �  � � � Y    R ��� � ��� � k   ! M � �  � � � I  ! )�� ���
�� .prcskprsnull���     ctxt � l  ! % ����� � n   ! % � � � 4   " %�� �
�� 
cha  � o   # $���� 0 i   � o   ! "���� 0 
textbuffer 
textBuffer��  ��  ��   �  � � � r   * 7 � � � l  * 5 ����� � I  * 5���� �
�� .sysorandnmbr    ��� nmbr��   � �� � �
�� 
from � m   , -���� 2 � �� � �
�� 
to   � m   . /���� Z � �� ���
�� 
seed � m   0 1���� ��  ��  ��   � o      ���� 0 d   �  � � � r   8 = � � � l  8 ; ����� � ^   8 ; � � � o   8 9���� 0 d   � m   9 :�������  ��   � o      ���� 0 de   �  ��� � Z   > M � ����� � l  > A ����� � =   > A � � � o   > ?���� 0 dodelay   � m   ? @��
�� boovtrue��  ��   � I  D I�� ���
�� .sysodelanull��� ��� nmbr � o   D E���� 0 de  ��  ��  ��  ��  �� 0 i   � m    ����  � I   �� ���
�� .corecnte****       **** � n     � � � 2   ��
�� 
cha  � o    ���� 0 
textbuffer 
textBuffer��  ��   �  ��� � Z   S l � ����� � l  S V ����� � =   S V � � � o   S T���� 0 r   � m   T U��
�� boovtrue��  ��   � k   Y h � �  � � � I  Y `�� ���
�� .sysodelanull��� ��� nmbr � m   Y \ � � ?�      ��   �  ��� � I  a h�� ���
�� .prcskprsnull���     ctxt � o   a d��
�� 
ret ��  ��  ��  ��  ��   � 4    �� �
�� 
pcap � m     � � � � �  T e r m i n a l � m      � ��                                                                                  sevs  alis    \  Macintosh HD                   BD ����System Events.app                                              ����            ����  
 cu             CoreServices  0/:System:Library:CoreServices:System Events.app/  $  S y s t e m   E v e n t s . a p p    M a c i n t o s h   H D  -System/Library/CoreServices/System Events.app   / ��   �  ��� � I  o t�� ���
�� .sysodelanull��� ��� nmbr � o   o p�� 	0 pause  ��  ��   �  ��~ � l     �}�|�{�}  �|  �{  �~       �z � � ��z   � �y�x�y 0 	execsetup 	execSetup�x 0 execcmd execCmd � �w <�v�u � ��t�w 0 	execsetup 	execSetup�v  �u   �   �  G�s�r y�q u g�p�o o�n�m
�s .miscactvnull��� ��� null
�r .sysodelanull��� ��� nmbr
�q 
pcap
�p .prcskprsnull���     ctxt
�o 
ret 
�n 
faal
�m eMdsKctl�t :� *j Okj UO� %*��/ �j O�j O���kvl UOkj U � �l ��k�j � ��i�l 0 execcmd execCmd�k �h ��h  �  �g�f�e�d�g 0 
textbuffer 
textBuffer�f 	0 pause  �e 0 r  �d 0 dodelay  �j   � �c�b�a�`�_�^�]�c 0 
textbuffer 
textBuffer�b 	0 pause  �a 0 r  �` 0 dodelay  �_ 0 i  �^ 0 d  �] 0 de   �  ��\ ��[�Z�Y�X�W�V�U�T�S�R�Q�P�O�N ��M
�\ 
pcap
�[ 
pisf
�Z 
cha 
�Y .corecnte****       ****
�X .prcskprsnull���     ctxt
�W 
from�V 2
�U 
to  �T Z
�S 
seed�R �Q 
�P .sysorandnmbr    ��� nmbr�O�
�N .sysodelanull��� ��� nmbr
�M 
ret �i u� k*��/ ce*�,FO @k��-j kh ��/j O*������� E�O��!E�O�e  
�j Y h[OY��O�e  a j O_ j Y hUUO�j ascr  ��ޭ